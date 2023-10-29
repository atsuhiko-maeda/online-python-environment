var editor;
var pyodideReadyPromise;
const sampleCode = `import math

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

function init(){
    const output = document.querySelector('#output');
    const code_edior = document.querySelector('#code-editor');

    // CodeMirrorを初期化
    editor = CodeMirror.fromTextArea(code_edior, {
        mode: "python",
        lineNumbers: true,
        theme: "material-palenight"
    });
    editor.setSize("100%", "90%");

    // サンプルコードを設定

    editor.setValue(sampleCode); // 初期コードをセット

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
    console.log(sel.value);

    fetch("./materials/"+sel.value+".py", {
        method: "GET",
      }).then(response => response.text())
      .then(text => {
        console.log(text);
      });
}

// const sample = document.getElementById("sample");
// const text = document.getElementById("text")

// //ダイアログでファイルが選択された時
// sample.addEventListener("change", function (event) {

//   const file = event.target.files;
//   const reader = new FileReader();
//   reader.readAsText(file[0]);

//   //読込終了後の処理
//   reader.onload = function () {
//     //テキストエリアに表示する
//     text.value = reader.result;
//   }
// });