let editor;
let output;
let pyodideReadyPromise;
let fileName="untitled.py";

const sampleCode = `import math
import numpy as np

list = [n for n in range(0,10)]
print(list[5:8])

print(math.sin(0.5))
print(math.log(10))

array1=[1,2,3]
array2=[4,5,6]
for x,y in zip(array1,array2):
    print(x,y)

dict_ = {'a':123,'b':456}

for k in dict_:
    print(k,dict_[k])

def add(x,y):
    return x+y

print(add(100,200))
`;

const SETTING = JSON.parse(localStorage.getItem("SETTING"))??  {
    'FONT_SIZE':24
    ,'THEME': 'monokai'
    ,'CODE':sampleCode
};

const theme_array_bright = [
    "chrome",
    "dawn",
    "github",
    "iplastic",
    "github",
    "tomorrow",
    "kuroir",
    "katzenmilch"
];
    
const theme_array_dark = [
    "ambiance",
    "dracula",
    "cobalt",
    "gruvbox",
    "kr_theme",
    "merbivore_soft",
    "mono_industrial",
    "monokai",
    "pastel_on_dark",
    "tomorrow_night"
];

function init(){

    editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/python");
  
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,

        showInvisibles: true, 
        hScrollBarAlwaysVisible: true,
        vScrollBarAlwaysVisible: true,
        fontSize:SETTING['FONT_SIZE'] + "px",
        theme: "ace/theme/"+SETTING['THEME']
    });
    editor.session.setValue(SETTING['CODE']);


    output = ace.edit("output");
    output.setOptions({
        highlightActiveLine: false,
        readOnly: true,
        wrapBehavioursEnabled: true,
        hScrollBarAlwaysVisible: true,
        vScrollBarAlwaysVisible: true,
        highlightGutterLine:false,
        showGutter: false,
        fontSize:SETTING['FONT_SIZE'] + "px",
        theme: "ace/theme/"+SETTING['THEME']
    });

    // define a new console
    var console=(function(oldCons){
        return {
            log: function(text){
                oldCons.log(text);
                output.session.setValue(output.getValue() + text+"\n");
            },
            info: function (text) {
                oldCons.info(text);
                // output.value+=text;
            },
            warn: function (text) {
                oldCons.warn(text);
                // output.value+=text;
            },
            error: function (text) {
                oldCons.error(text);
                // output.value+=text;
            }
        };
    }(window.console));
    //Then redefine the old console
    window.console = console;


    output.session.setValue("読み込み中...\n");

    // init Pyodide
    async function main() {
        let pyodide = await loadPyodide();
        
        await pyodide.loadPackage("numpy");
        await pyodide.loadPackage("matplotlib");
        // await pyodide.loadPackage("scikit-learn");
        
        output.session.setValue("準備完了!\n");    
        return pyodide;
    }
    pyodideReadyPromise = main();



    // JSONファイルを取得して表示
    fetch("excercises.json")
        .then( response => response.json())
        .then( data => {
            const excercises = document.querySelector("#excercises");
            for(const d of data){
                const optgroup = document.createElement('optgroup');
                optgroup.label=d['chapter'];
                // console.log(d['chapter']);
                // console.log(d);
                for(const e of d['exercises']){
                    const option = document.createElement('option');
                    option.value=e;
                    option.textContent=e;
                    optgroup.appendChild(option);    
                }
                excercises.appendChild(optgroup);
            }
        });

    init_ui();
}

function init_ui(){
    // themeの選択肢を作成
    const set_theme = (elem, list)=>{
        for (const t of list){
            const option = document.createElement('option');
            option.value = t;
            option.textContent = t;
            if (option.value==SETTING['THEME'])
                option.selected=true;
            else
                option.selected=false;
    
                elem.appendChild(option);
        }    
    };
    const bright = document.querySelector("#theme-selector #Bright");
    const dark = document.querySelector("#theme-selector #Dark");
    set_theme(bright,theme_array_bright);
    set_theme(dark,theme_array_dark);

    // テーマ選択要素の変更イベントを監視
    const themeSelector = document.querySelector("#theme-selector");
    themeSelector.addEventListener("change", function() {
        // var selectedTheme = themeSelector.value;
        SETTING['THEME']=themeSelector.value;

        editor.setTheme("ace/theme/"+SETTING['THEME']);
        output.setTheme("ace/theme/"+SETTING['THEME']);

        save_settings();
    });

    function changeFontSize(value) {
        SETTING['FONT_SIZE']=SETTING['FONT_SIZE']+value;
        editor.setFontSize(SETTING['FONT_SIZE'] + "px");
        output.setFontSize(SETTING['FONT_SIZE'] + "px");
    }

    document.querySelector("#increase_font_size").addEventListener("click",function(){
        changeFontSize(1);
        save_settings();
    });

    document.querySelector("#decrease_font_size").addEventListener("click",function(){
        changeFontSize(-1);
        save_settings();
    });

    document.querySelector("#run").addEventListener("click",function(){
        SETTING['CODE']=editor.getValue();
        save_settings();
        evaluatePython();
    });

    document.querySelector("#download").addEventListener('click', function() {

        const content = editor.getValue();;    
        // テキストファイルをBlob形式に変換する
        let blob = new Blob([content]);    
        // Blobデータに対するURLを発行する
        let blobURL = window.URL.createObjectURL(blob);    
        // URLをaタグに設定する
        let a = document.createElement('a');
        a.href = blobURL;
        // download属性でダウンロード時のファイル名を指定
        if (typeof aaresult === "undefined") {
          a.download=fileName;
        } else {
          a.download = aaresult.name;
        }; 
    
        // Firefoxの場合は、実際にDOMに追加しておく必要がある
        document.body.appendChild(a);
        // CLickしてダウンロード
        a.click();
        // 終わったら不要なので要素を削除
        a.parentNode.removeChild(a);
    });
}

function save_settings(){
    localStorage.setItem("SETTING",JSON.stringify(SETTING));
}

async function evaluatePython() {
    output.session.setValue("");

    let pyodide = await pyodideReadyPromise;
    pyodide.FS.writeFile("test.py", editor.getValue());

    let promise = new Promise((resolve, reject) => {
        pyodide.runPython(`
            exec(open('test.py').read())
        `)
    }).catch(err => {
            console.log(err);
    });

    await promise;
}

function setMaterial(){
    const sel = document.querySelector('#excercises');
    if (!sel.value){
        alert("ファイルがありません.");
        // console.log("!sel.value");
        return;
    }

    fileName=sel.value;
    fetch("./excercises/"+fileName, {
        method: "GET",
    })
    .then(response => response.text())
    .then(text => {

        var pattern = /#<shuffle>([\s\S]*?)#<\/shuffle>/g;
        var newText = text.replace(pattern, function(match, capturedText) {

            // alert(match);
            // alert(capturedText);
            // 改行文字で分割し、行ごとに配列に格納
            // var lines = match.trim().split('\n');
            var lines = match.split('\n');

            // 配列をシャッフル
            for (var i = 1; i < lines.length-1; i++) {
                var j = Math.floor(1+Math.random() * (lines.length-1));
                [lines[i], lines[j]] = [lines[j], lines[i]];
            }
            // for (var i = lines.length - 2; i > 1; i--) {
            //     var j = Math.floor(Math.random() * (i + 1));
            //     [lines[i], lines[j]] = [lines[j], lines[i]];
            // }

            // シャッフルされた行を結合して新しいテキストとして返す
            return lines.join('\n');
        });
        // alert(newText);

        editor.session.setValue(newText);
    });
}