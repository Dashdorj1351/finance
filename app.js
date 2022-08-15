// desktop Controller
var uiController = (function() {
    var DOMstring = {
        inputType : ".add__type",
        inputDiscription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        inputListInc : '.income__list',
        inputListExp : '.expenses__list'
    };
    return {
        getInput: function(){
            return{
                type : document.querySelector(DOMstring.inputType).value,
                description : document.querySelector(DOMstring.inputDiscription).value,
                value : document.querySelector(DOMstring.inputValue).value,
            };
        },
        getDOMstrings: function(){
            return DOMstring;
        },
        addListItem : function(item, type) {
            //Орлого зарлага хэтл бэлтгэнэ.
            var html, list;
            
            if(type === 'inc'){
                list = DOMstring.inputListInc;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">$$desc$$</div><div class="right clearfix"><div class="item__value">$$value$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else{
                list = DOMstring.inputListExp;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">$$desc$$</div><div class="right clearfix"><div class="item__value">$$value$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглах өөрчилж өгнө.
            html = html.replace('%id%', item.id);
            html = html.replace('$$desc$$', item.description);
            html = html.replace('$$value$$', item.value);
            //Бэлтгэсэн HTML ээ DOM руу хийж өгнө. 
            document.querySelector(list).insertAdjacentHTML('beforeend', html);
        }
    };
})();

// Finance Controller
var financeController = (function() {
    var Income = function(id, description, value){
        this.id =id;
        this.description = description;
        this.value = value;
    };
    var Expense = function(id, description, value){
        this.id =id;
        this.description = description;
        this.value = value;
    };
    var data = {
        items : {
            inc : [],
            exp : [],
        },
        totals : {
            inc : 0,
            exp : 0,
        },    
    };
    return{
        addItem : function(type, des, val) { 

            var item, id;

            if(data.items[type].length === 0) id = 1;
            else{
                id = data.items[type][data.items[type].length - 1].id + 1;
            }

            if(type === 'inc'){
                item = new Income(id, des, val);
            }else{
                item = new Expense(id, des, val);
            }
            data.items[type].push(item);
            return item;
        }
    }
})();


var appController = (function(uiC, fnC) {
    var ctrlAddItem = function() {
        // Оруулах өгөгдийг дэлгэцнээс олж авна.
        var input = uiC.getInput();
        // Олж авсан өгөгдлүүдээ санхүүд дамжуулна.
        var item = fnC.addItem(
            input.type, 
            input.description, 
            input.value
        );
        // Олж авсан өгөгдлүүдээ тохирох хэсэгт гаргана.
        uiC.addListItem(item, input.type);
        // Төсбийг тооцоолно.
        // Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
    };
    var setupEventListners = function() {
    var DOM = uiC.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', function() {
        ctrlAddItem();
    });
    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
    }
    return {
    init : function() {
        console.log('Программ эхэллээ.');
        setupEventListners();
    }
    }
})(uiController, financeController);
appController.init();