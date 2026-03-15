
import { readFile } from "./util.js";



//achtung \s machted auch linebreaks
function isSpace(char)  {

    return /\s/.test(char)
}

function isNum(char) {

    return /[0-9]/.test(char);
}

function isAlpha(char) {

    return /[a-zA-Z]/.test(char)
}

function expectString(token) {
    if(token[0] != '"') throw Error("expected String!");
    return true;
}

function expect(str, expectedStr) {
    if(str != expectedStr) throw Error("Expected Error!");
    
    return true;

}



//es gibt kein Import in glsl also baue ich es einfach selber xD 
export async function parseShaderFile(path) {
    
    let shader = await readFile(path);
    let currentIndex = 0;
    let currentChar = shader[0];
    //durchsuche shaderfile nach import statements bis zu ersten funktions deklaration 
    //literal " " literal (  

    let headerIndexEnd = 0;
    let header = "";
    let body = "";

    let tokens = [];

   while(currentIndex < shader.length) {
    

    // sdkaajdkj    alksjdklaj   asd lkjsdalks  

    // ALNUM ALNUM ALNUM ;
    // ALNUM ALNUM ALNUM ;
    // ALNUM ALNUM ALNUM ; hört auf

    // ALNUM ALNUM (

    if(currentChar  == "/") {
        while(currentChar != "\n") {
            currentIndex ++;
            currentChar = shader[currentIndex];
        }
    }


    if(currentChar == '"'){
        let start = currentIndex;

        currentIndex++;
        currentChar = shader[currentIndex];
        let str = "";
        
        
        while(currentChar != '"') {

            str += currentChar;

            currentIndex++;
            currentChar = shader[currentIndex];
            if(currentIndex == shader.length) throw Error("Unclosed String!");
        }
        tokens.push({start: start, value: `"${str}"`});
    }



    if (currentChar == "#") {
    let start = currentIndex;
    while (currentChar !== "\n" && currentIndex < shader.length) {
        currentIndex++;
        currentChar = shader[currentIndex];
    }
    headerIndexEnd = currentIndex;
    continue;
}


    if(isAlpha(currentChar)) {
        let literal = "";
        let start = currentIndex;
        while(isAlpha(currentChar) || isNum(currentChar)) {
            literal += currentChar;

            currentIndex++;
            currentChar = shader[currentIndex];
        }

        tokens.push({start: start, value: literal});
    }


    if(currentChar == ";") {
        headerIndexEnd = currentIndex;
        tokens.push({start: currentIndex, value: ";"});
    }

    if(currentChar == "(") {
        break;
    };


    //trim spaces
    if(isSpace(currentChar)) {
        while(isSpace(currentChar)) {
            currentIndex++;
            currentChar = shader[currentIndex];
            }
        continue;
    }


    currentIndex++;
    currentChar = shader[currentIndex];
 }


    let currentToken = tokens[0];
    let currentIndexToken = 0;


    let offset = 0;
    header = shader.substring(0, headerIndexEnd + 1);

    while(currentIndexToken < tokens.length) {



        if(currentToken.value == "import") {
        
            header = header.slice(0, currentToken.start - offset) + header.slice(currentToken.start - offset + currentToken.value.length); //remove import statement
        

            offset +=  currentToken.value.length;
            currentIndexToken++;
            currentToken = tokens[currentIndexToken];
            
            expectString(currentToken.value);


            header = header.slice(0, currentToken.start - offset) + header.slice(currentToken.start - offset + currentToken.value.length + 1); //remove str + "

            offset +=  currentToken.value.length + 1;
            
            const path = currentToken.value.substring(1, currentToken.value.length - 1);


            currentIndexToken++;
            currentToken = tokens[currentIndexToken];


            expect(currentToken.value, ";");

            header = header.slice(0, currentToken.start- offset) + header.slice(currentToken.start - offset + currentToken.value.length); //;


            offset +=  currentToken.value.length;
            const data = await parseShaderFile(path);
           
            header += data.header.trim() + "\n";

            body += data.body; 
            
            body = body.trimEnd();
            body += "\n";
        }

        currentIndexToken++;
        currentToken = tokens[currentIndexToken];
    }

    body += shader.substring(headerIndexEnd + 2);

    shader = header + body;



    return {header: header, body: body, shader: shader};
}

