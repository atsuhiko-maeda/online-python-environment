var editor;
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
var themeStyle;
var themeSelector;
const theme_array = ["3024-day", "3024-night", "abbott", "abcdef", "ambiance-mobile", "ambiance", "ayu-dark", "ayu-mirage", "base16-dark", "base16-light", "bespin", "blackboard", "cobalt", "colorforth", "darcula", "dracula", "duotone-dark", "duotone-light", "eclipse", "elegant", "erlang-dark", "gruvbox-dark", "hopscotch", "icecoder", "idea", "isotope", "juejin", "lesser-dark", "liquibyte", "lucario", "material-darker", "material-ocean", "material-palenight", "material", "mbo", "mdn-like", "midnight", "monokai", "moxer", "neat", "neo", "night", "nord", "oceanic-next", "panda-syntax", "paraiso-dark", "paraiso-light", "pastel-on-dark", "railscasts", "rubyblue", "seti", "shadowfox", "solarized", "ssms", "the-matrix", "tomorrow-night-bright", "tomorrow-night-eighties", "ttcn", "twilight", "vibrant-ink", "xq-dark", "xq-light", "yeti", "yonce", "zenburn"];

function init(){
    const output = document.querySelector('#output');
    const code_edior = document.querySelector('#code-editor');


    // // カスタムキーマップを定義
    // var customKeyMap = {
    //     "Ctrl-S": function(cm) {
    //     // Ctrl-Sが押されたときの処理
    //     alert("保存しました！");
    //     // ここに保存処理を追加することができます
    //     },
    //     "Ctrl-Z": "undo", // Ctrl-Zはデフォルトのアンドゥ動作をトリガー
    //     "Ctrl-Y": "redo", // Ctrl-Yはデフォルトのリドゥ動作をトリガー
    //     "Ctrl-F": "find",
    //     // 他のカスタムキーバインドを追加できます
    // };  
    // // カスタムキーマップをCodeMirrorに登録
    // CodeMirror.keyMap["my-custom-keymap"] = customKeyMap;

    // CodeMirrorを初期化
    editor = CodeMirror.fromTextArea(code_edior, {
        mode: "python",
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        theme: "zenburn",
        keyMap: "sublime"
        // keyMap: "my-custom-keymap"
    });
    editor.setSize("100%", "90%");

    themeStyle = document.getElementById("theme-style");

    const themeSelector = document.getElementById("theme-selector");
    for (const t of theme_array){
        const option = document.createElement('option');
        option.value = t;
        option.textContent = t;
        themeSelector.appendChild(option);
    }


    // テーマ選択要素の変更イベントを監視
    themeSelector.addEventListener("change", function() {
        var selectedTheme = themeSelector.value;
        // 選択されたテーマのCSSファイルを読み込む
        themeStyle.href = "https://codemirror.net/5/theme/" + selectedTheme + ".css";
        // エディタに選択されたテーマを適用
        editor.setOption("theme", selectedTheme);
    });
  
    // サンプルコードを設定
    editor.setValue(sampleCode);

    // define a new console
    var console=(function(oldCons){
        return {
            log: function(text){
                oldCons.log(text);
                // Your code
                output.value+=text+"\n";
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


    output.value = "Initializing...\n";
    // init Pyodide
    async function main() {
        let pyodide = await loadPyodide();
        
        await pyodide.loadPackage("numpy");
        // await pyodide.loadPackage("scikit-learn");

        output.value = "Ready!\n";
        return pyodide;
    }
    pyodideReadyPromise = main();
}

async function evaluatePython() {
    output.value="";
    let pyodide = await pyodideReadyPromise;
    pyodide.FS.writeFile("test.py", editor.getValue());

    let promise = new Promise((resolve, reject) => {
        pyodide.runPython(`
            exec(open('test.py').read())
        `)
    // import sys
    //     sys.modules.pop("test", None)
    // resolve(true)
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
