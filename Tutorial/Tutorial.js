import HtmlLoader from "../Core/Loaders/HtmlLoader.js";
import Menu from "../Core/Menu.js";
import Storage from "../Core/Storage.js";

export default class Tutorial extends Menu{

    constructor(){
        super();
        this.menu = document.querySelector('#tutorial');
        this.menucontext = HtmlLoader.Load('./assets/elements/TutorialWindow.html');
        this.menucontext.then(data =>{
            let context = data;
            let script = context.split('<script>')[1].split('</script>')[0];
            let html = context.split('<script>')[0];

            this.menu.innerHTML = html;

            eval(script);

            this.Hide()
            
            this.Trigger('ready')
        })
    }
    
    Start(){
        this.menu.style.display = 'flex';
        this.menu.classList.add('tutorial-show');
        this.currentStep = 0;
        this.correctPressed = [];

        this.data =  [
            {
                keys: ['w', 'a', 's', 'd'],
                title: "Use the following keys to move around"
            },
            {
                keys: ['i'],
                title: "Use the following key to open your inventory"
            },
            {
                keys: ['c'],
                title: "Use the following key to open your crafting menu"
            }
        ]

        this.keys = this.data[this.currentStep].keys;

        this.keysString = this.data[this.currentStep].keys.join('</kbd> + <kbd>');
        this.menu.innerHTML = `<h5>${this.data[this.currentStep].title}</h5> <br> <span> <kbd> ${this.keysString} </kbd> </span>`;

        document.addEventListener('keydown', (e) => {

            if(Storage.Get('tutorialcompleted') == null || Storage.Get('tutorialcompleted') == false){

                if(this.keys.includes(e.key)){
                    this.correctPressed.push(e.key);
                    this.keys = this.keys.filter(key => key !== e.key);
                } 
                if(this.keys.length === 0){
                    this.currentStep++;
                    
                    if(this.currentStep < this.data.length){
                        this.keysString = this.data[this.currentStep].keys.join('</kbd> + <kbd>');
                        this.menu.innerHTML = `<h5>${this.data[this.currentStep].title}</h5> <br> <span> <kbd> ${this.keysString} </kbd> </span>`;
                        this.keys = this.data[this.currentStep].keys;
                    } else{
                        this.Complete();
                    }
                    
                }
                console.log(this.keys);
            }
        })   
    }
    
    Complete(){
        
        let img = document.createElement('img');
        img.src = './assets/images/clipart-sword-soldier-3.png';
        img.classList.add('tutorial-complete');
        document.body.appendChild(img);

        this.menu.classList.add('tutorial-hide');
        setTimeout(() => {
            this.Hide();
            
        }, 1000);
        setTimeout(() => {
            document.body.removeChild(img);
        }, 5000);

        Storage.Set('tutorialcompleted', true);
    }

    Reset(){
        this.Start();
        Storage.Set('tutorialcompleted', false);
    }

}