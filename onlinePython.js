var editor;
var output_cm;
var pyodideReadyPromise;

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
    ,'THEME': 'Default'
    ,'CODE':sampleCode
};

const theme_array = ["3024-day", "3024-night", "abbott", "abcdef", "ambiance-mobile", 
"ambiance", "ayu-dark", "ayu-mirage", "base16-dark", "base16-light", "bespin", 
"blackboard", "cobalt", "colorforth", "darcula", "dracula", "duotone-dark", 
"duotone-light", "eclipse", "elegant", "erlang-dark", "gruvbox-dark", "hopscotch", 
"icecoder", "idea", "isotope", "juejin", "lesser-dark", "liquibyte", "lucario", 
"material-darker", "material-ocean", "material-palenight", "material", "mbo", 
"mdn-like", "midnight", "monokai", "moxer", "neat", "neo", "night", "nord", 
"oceanic-next", "panda-syntax", "paraiso-dark", "paraiso-light", "pastel-on-dark", 
"railscasts", "rubyblue", "seti", "shadowfox", "solarized", "ssms", "the-matrix", 
"tomorrow-night-bright", "tomorrow-night-eighties", "ttcn", "twilight", 
"vibrant-ink", "xq-dark", "xq-light", "yeti", "yonce", "zenburn"];

function init(){
    const code_edior = document.querySelector('#code-editor');
    const output = document.querySelector('#output');

    // CodeMirrorを初期化
    const themeStyle = document.querySelector("#theme-style");
    themeStyle.href = "https://codemirror.net/5/theme/" + SETTING['THEME'] + ".css";

    editor = CodeMirror.fromTextArea(code_edior, {
        mode: "python",
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        theme: SETTING['THEME'],
        keyMap: "sublime",
        lineWrapping:true
    });
    editor.setSize("100%", "90%");
    editor.setValue(SETTING['CODE']);

    output_cm = CodeMirror.fromTextArea(output, {
        theme: SETTING['THEME'],
        lineWrapping:true
    });
    output_cm.setSize("100%", "100%");
    output_cm.setOption("readOnly", true);

    const textElements = document.querySelectorAll(".CodeMirror");
    for (let i=0 ; i<textElements.length ; i++)
        textElements[i].style.fontSize = SETTING['FONT_SIZE'] + "px";

    // define a new console
    var console=(function(oldCons){
        return {
            log: function(text){
                oldCons.log(text);
                // Your code
                // output.value+=text+"\n";
                output_cm.setValue(output_cm.getValue() + text+"\n");
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


    // output.value = "Initializing...\n";
    output_cm.setValue("読み込み中...\n");

    // init Pyodide
    async function main() {
        let pyodide = await loadPyodide();
        
        await pyodide.loadPackage("numpy");
        await pyodide.loadPackage("matplotlib");
        // await pyodide.loadPackage("scikit-learn");

        // output.value = "Ready!\n";
        output_cm.setValue("準備完了!\n");    
        return pyodide;
    }
    pyodideReadyPromise = main();

    init_ui();
}

function init_ui(){
    // themeの選択肢を作成
    const themeSelector = document.querySelector("#theme-selector");
    for (const t of theme_array){
        const option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        if (option.value==SETTING['THEME'])
            option.selected=true;
        else
            option.selected=false;

        themeSelector.appendChild(option);
    }

    // テーマ選択要素の変更イベントを監視
    themeSelector.addEventListener("change", function() {
        var selectedTheme = themeSelector.value;
        const themeStyle = document.querySelector("#theme-style");
        themeStyle.href = "https://codemirror.net/5/theme/" + selectedTheme + ".css";
        SETTING['THEME']=selectedTheme;
        editor.setOption("theme", selectedTheme);
        output_cm.setOption("theme",selectedTheme);
        save_settings();
    });

    function changeFontSize(value) {
        SETTING['FONT_SIZE']=SETTING['FONT_SIZE']+value;

        const textElements = document.querySelectorAll(".CodeMirror");
        for (let i=0 ; i<textElements.length ; i++)
            textElements[i].style.fontSize = SETTING['FONT_SIZE'] + "px";

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


}

function save_settings(){
    localStorage.setItem("SETTING",JSON.stringify(SETTING));
}

async function evaluatePython() {
    // output.value="";
    output_cm.setValue("");

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
    const sel = document.querySelector('#educational-material');
    if (!sel.value){
        console.log("!sel.value");
        return;
    }

    fetch("./materials/"+sel.value+".py", {
        method: "GET",
    })
    .then(response => response.text())
    .then(text => {editor.setValue(text);});
}