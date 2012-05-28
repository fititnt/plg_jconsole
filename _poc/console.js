var Console = {};

Console = (function() {
    
    var ConsoleInstance; // Private attribute that holds the single instance.
    var OutputConteiner; //Instace of coneiner
    var OutputInput; //Instace of coneiner
    var OutputLog; //Instace of coneiner
    var lcSrefix = 'console_'; //Prefix of localStorage
    var debug = 1;
    var consolePrefix = 'public';
    var consoleSufix = location.host;
    
    //Default values
    var Options = {
        output: {
            id: 'console'
        }
    };
    
    function constructor(UserOptions) {
        if(Options){
            Console.Options = UserOptions; 
        }
        
        window.addEventListener('keyup', listenerConsoleOpen, false); //Fail IE lt9
       
        if(localStorage[lcSrefix + 'display'] === 1){
            createOutputConteiner();
        }
        
    //createOutputConteiner();
    }
    
    function consoleLineAdd(content) {
        var commandCont = document.createElement("pre");
        content = content.replace(consolePrefix + '@' + consoleSufix + '$ ', '');        
        commandCont.appendChild(document.createTextNode(consolePrefix + '@' + consoleSufix + '$ ' +  content));
        OutputLog.appendChild(commandCont);
        
        
        if (content.search('/js ') === 0){
            content = content.replace('/js ', ''); //js code now
            content = eval(content);//Eval is evil

            commandCont = document.createElement("pre");//new line
            commandCont.appendChild(document.createTextNode(content));
            OutputLog.appendChild(commandCont);
        }
        
    }
    
    var listenerConsoleOpen = function listenerConsoleOpen(e) {
        if (e.keyCode === 88 && e.ctrlKey) {//Letra x, pressionada com shift
            if (!OutputConteiner) {
                createOutputConteiner();
            } else {
                if (OutputConteiner.style.display === 'none') {
                    OutputConteiner.style.display = 'block';
                    localStorage[lcSrefix + 'display'] = 1;
                    OutputInput.focus();
                    if(debug) console.log(lcSrefix + 'display' + ' is now 1');
                } else {
                    OutputConteiner.style.display = 'none';
                    localStorage[lcSrefix + 'display'] = 0;
                    if(debug) console.log(lcSrefix + 'display' + ' is now 0');
                } 
            }
        }
    }
    
    var listenerConsoleInput = function listenerConsoleInput(e) {
        if (e.keyCode === 13) {//Enter
            if (e.shiftKey) {//... Shift + Enter
                OutputInput.rows = OutputInput.rows + 1;
                OutputInput.style.height = OutputInput.rows + '.3em';
            } else {
                consoleLineAdd(OutputInput.value);
                OutputInput.rows = 1;
                OutputInput.style.height = '1em';
                OutputInput.value = consolePrefix + '@' + consoleSufix + '$ ';
            }
            console.log('oi')
        }
        
    }
    
    function createOutputConteiner() {
        var outConteiner = document.createElement("div");
        var outInput = document.createElement("textarea");
        var outLog = document.createElement("div");
        
        //Conteiner
        outConteiner.setAttribute('id', Console.Options.output.id);
        outConteiner.style.position = 'fixed';
        outConteiner.style.width = '100%';
        outConteiner.style.bottom = '0';
        outConteiner.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        outConteiner.style.color = '#00FF00';
        
        //Log
        outLog.setAttribute('id', Console.Options.output.id + '-log');
        outLog.style.width = '100%';
        outLog.style.color = '#00FF00';
        outConteiner.appendChild(outLog);

        //Input
        outInput.setAttribute('id', Console.Options.output.id + '-input');
        outInput.style.width = '100%';
        outInput.style.color = '#00FF00';
        outInput.style.backgroundColor = 'black';
        outInput.style.border = 'none';
        outInput.rows = 1;
        outInput.style.height = '1em';
        outInput.appendChild(document.createTextNode(consolePrefix + '@' + consoleSufix + '$ '));
        outConteiner.appendChild(outInput);
        //Add to page and get references
        document.body.appendChild(outConteiner);
        OutputConteiner = document.getElementById(Console.Options.output.id);
        OutputInput = document.getElementById(Console.Options.output.id + '-input');
        OutputLog = document.getElementById(Console.Options.output.id + '-log');
        
        //Add listeners
        OutputInput.addEventListener('keyup', listenerConsoleInput, false); //Fail IE lt9
    }
    
    //Private
    function createOutput() {

    };
    
    return {
        getInstance: function(UserOptions) {
            if(!ConsoleInstance) { // Instantiate only if the instance doesn't exist.
                ConsoleInstance = constructor(Options);
            }
            return ConsoleInstance;
        }
    }
})();