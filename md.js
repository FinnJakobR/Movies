

const BLOCK_TOKENS = Object.freeze({
    "HEADER": 0,
    "PARAGRAPH": 1,
    "HR": 2,
    "BLOCK_QUOTE":3,
    "NONE": 4
});


const INLINE_LIMITER = Object.freeze({

    O_BRACKET: 0,
    C_BRACKET: 1,
    STAR: 2,
    NONE: 3,
    

});

const INLINE_MAP = new Map([[INLINE_LIMITER.O_BRACKET, "["],
    [INLINE_LIMITER.C_BRACKET, "]"],
    [INLINE_LIMITER.STAR, "*"]])

const INLINE_TOKENS = Object.freeze({
    TEXT: 0,
    TAG: 1,
    BOLD: 2,
    ITALIC: 3,
})


const BLOCK_MAP = new Map(
    [
    [BLOCK_TOKENS.HEADER, "#"],
    [BLOCK_TOKENS.HR, "-"],
    [BLOCK_TOKENS.BLOCK_QUOTE, ">"]
    ]
)



function isSpace(c){
    return c == " " || c === "\t";
}

function isNewline(c) {

    return c == "\n";
}

function getByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}

export function renderHTML(blocks) {

    function renderInline(tokens) {
        let html = "";

        for (const token of tokens) {

            switch (token.token) {

                case INLINE_TOKENS.TEXT:
                    if (token.text) {
                        html += token.text;
                    }
                    if (token.inlines) {
                        html += renderInline(token.inlines);
                    }
                    break;

                case INLINE_TOKENS.BOLD:
                    html += "<strong>" + renderInline(token.inlines) + "</strong>";
                    break;

                case INLINE_TOKENS.ITALIC:
                    html += "<em>" + renderInline(token.inlines) + "</em>";
                    break;

                case INLINE_TOKENS.TAG:
                    html += "<span>" + renderInline(token.inlines) + "</span>";
                    break;
            }
        }

        return html;
    }

    function renderBlock(block) {

        console.log(block);

        switch (block.token) {

            case BLOCK_TOKENS.HEADER:
                return `<h${block.depth}>${renderInline(block.inlines.flat())}</h${block.depth}>`;

            case BLOCK_TOKENS.PARAGRAPH:
                return `<p>${renderInline(block.inlines.flat())}</p>`;


            case BLOCK_TOKENS.HR: 
                return `<hr>`

            case BLOCK_TOKENS.BLOCK_QUOTE: 
                return `<blockquote>${block.childs.flat().map(renderBlock).join("")}</blockquote>`

            default:
                return "";
        }
    }

    return blocks.map(renderBlock).join("\n");
}




export default class Markdown{

    constructor(source) {
        this.source = source;
        this.index = 0;
        this.current_char = this.source[this.index];
    }

    isEnd(){
        return this.source.length <= this.index;
    }

    nextChar(){
        this.index++;
        this.current_char = this.source[this.index];
    }


    parse(){

        this.blocks = [];

        while(!this.isEnd()){
            const block = this.parseBlock();
            this.blocks.push(block);
        }

        return this.blocks;

    }

    trimLeft(){
        while(isSpace(this.current_char)) {
            this.nextChar();
        }

    }

    parseHeader(){
        let depth = 0;

        while(this.current_char == BLOCK_MAP.get(BLOCK_TOKENS.HEADER)){
            depth++;
            this.nextChar();
        }


        this.trimLeft();

        const inline = this.parseInline();

        this.nextChar(); //chop newLine!;

        return {token: BLOCK_TOKENS.HEADER, depth: depth, inlines: [inline]};

    }

    //returns Block Token!
    isBlockToken(c) {
        return getByValue(BLOCK_MAP, c) ?? BLOCK_TOKENS.NONE;
    }

    isInlineLimiter(c){
        return getByValue(INLINE_MAP, c) ?? INLINE_LIMITER.NONE;
    }

    lookAhead(num){
        return this.source[this.index + num];
    }

    parseParagraph(){
        const inlines = [this.parseInline()];

        console.log("c",this.current_char);

        while(isNewline(this.current_char)) {

            this.nextChar();
            //wenn \n\n ist dann ist new Paragraph
            if(isNewline(this.current_char)) return {
                type: 'block', token: BLOCK_TOKENS.PARAGRAPH, inlines: inlines
            }

            //wenn ein BlockToken kommt!



            if(this.isBlockToken(this.current_char) != BLOCK_TOKENS.NONE) return {
                 type: 'block', token: BLOCK_TOKENS.PARAGRAPH, inlines: inlines
            }

            inlines.push(this.parseInline());

        }



        return {
                 type: 'block', token: BLOCK_TOKENS.PARAGRAPH, inlines: inlines
        }

    }

    parseHr(){


        while(!isNewline(this.current_char) && !this.isEnd()) {
            this.nextChar();
        }

        return {type: 'block', token: BLOCK_TOKENS.HR, inlines: []};

        //chop einfach alles von der Zeile weg reicht mir;

        
    }

    parseBlockQuote(){

        this.trimLeft();

        let childs = [];

        while(this.isBlockToken(this.current_char) == BLOCK_TOKENS.BLOCK_QUOTE){
            this.nextChar(); // >
            this.trimLeft();

            childs.push(this.parseBlock());
        }

        return {type: 'block', token: BLOCK_TOKENS.BLOCK_QUOTE, childs: childs}


    }

    parseBlock(){
        this.trimLeft();

            while(isNewline(this.current_char)){
                    this.nextChar()
            }

        switch(this.current_char) {

            case BLOCK_MAP.get(BLOCK_TOKENS.HEADER):
                 return  this.parseHeader();


            case BLOCK_MAP.get(BLOCK_TOKENS.HR):
                if(this.isBlockToken(this.lookAhead(1)) == BLOCK_TOKENS.HR){
                    this.nextChar(); //-
                    this.nextChar(); //-
                    return this.parseHr();
                }

            
            case BLOCK_MAP.get(BLOCK_TOKENS.BLOCK_QUOTE):
                return this.parseBlockQuote();

            
            default: 
                return this.parseParagraph();
        }


    }

    parseInlineToken(){



        switch(this.current_char) {

            case INLINE_MAP.get(INLINE_LIMITER.STAR):
                this.nextChar();

                let start_tokens = [];




                if(this.isInlineLimiter(this.current_char) == INLINE_LIMITER.STAR) {
                    this.nextChar();

                    //*


                    while(this.isInlineLimiter(this.current_char) != INLINE_LIMITER.STAR 
                    || this.isInlineLimiter(this.lookAhead(1)) != INLINE_LIMITER.STAR) {
                        start_tokens.push(this.parseInlineToken());
                        //TODO ADD NEWLINE X ISEND
                    }

                    //*


                        this.nextChar(); //*
                        this.nextChar(); //*                        
                     
                     return {type: 'inline', token: INLINE_TOKENS.BOLD, inlines: start_tokens};

                } else {


                    while(this.isInlineLimiter(this.current_char) != INLINE_LIMITER.STAR) {
                        start_tokens.push(this.parseInlineToken());
                    }

                    this.nextChar(); //*

                    return {type: 'inline', token: INLINE_TOKENS.ITALIC, inlines: start_tokens};
                }


            case INLINE_MAP.get(INLINE_LIMITER.O_BRACKET):
                this.nextChar();
                let tokens = [];

                while(this.isInlineLimiter(this.current_char) != INLINE_LIMITER.C_BRACKET){
                    tokens.push(this.parseInlineToken());


                    if(this.isEnd() || isNewline(this.current_char))  return {type: 'inline', token: INLINE_TOKENS.TAG, inlines: tokens };
                }

                this.nextChar(); //chop ]

                return {type: 'inline', token: INLINE_TOKENS.TAG, inlines: tokens }

            default:

                let text = "";

                while(this.isInlineLimiter(this.current_char) == INLINE_LIMITER.NONE) {

                    text+= this.current_char;
                    this.nextChar();


                    if(this.isEnd() || isNewline(this.current_char)) return {
                        type: 'inline', token: INLINE_TOKENS.TEXT, text: text
                    }

                }

                return {
                        type: 'inline', token: INLINE_TOKENS.TEXT, text: text
                }
            }
    }

    parseInline(){
        let inlines = [];


        while(!isNewline(this.current_char) && !this.isEnd()) {

            inlines.push(this.parseInlineToken());
        }

        
        //[line[tokens]]
        return [{type: 'inline', token: INLINE_TOKENS.TEXT, inlines: inlines}];
    
    };

}