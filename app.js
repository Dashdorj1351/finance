// desktop Controller
var uiController = (function() {
    var DOMstring = {
        inputType : ".add__type",
        inputDiscription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        inputListInc : '.income__list',
        inputListExp : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        containerDiv : '.container',
        expensesPercentage : '.item__percentage',
        dateLabel : '.budget__title--month',
    };
    var nodeListForEach = function(list, Callback){
        for(var i = 0; i < list.length; i++){
            Callback(list[i], i);
        };
    };
    var formatMoney = function(too, type){
        too = '' + too;
        var x = too.split("").reverse().join("");
        var y = "";
        var count = 1;
        for(var i = 0; i < x.length; i++){
            y = y + x[i];
            if (count % 3 === 0) y = y + ",";
            count ++;
        }
        var z = y.split("").reverse().join("");
        if(z[0] === ",") z = z.substring(1, z.length - 1);
        if (type === 'inc') z = '+ ' + z;
        else z = '- ' + z;
        return z;
    };
    return {
        changeType : function(){
            var feilds = document.querySelectorAll(DOMstring.inputType + ', ' + DOMstring.inputDiscription + ', ' + DOMstring.inputValue);
            nodeListForEach(feilds, function(el){
                el.classList.toggle('red-focus');
            });
            document.querySelector(DOMstring.inputBtn).classList.toggle('red');
        },
        getInput: function(){
            return{
                type : document.querySelector(DOMstring.inputType).value,
                description : document.querySelector(DOMstring.inputDiscription).value,
                value : parseInt(document.querySelector(DOMstring.inputValue).value)
            };
        },
        despleyDate : function(){
            var today = new Date();
            document.querySelector(DOMstring.dateLabel).textContent = today.getMonth() + ' сарын'
        },
        despleyPercentages : function(allPercentages){
            var elements = document.querySelectorAll(DOMstring.expensesPercentage);
            nodeListForEach(elements, function(el, index){
                el.textContent = allPercentages[index];
            });
        },
        getDOMstrings: function(){
            return DOMstring;
        },
        clearFields : function(){
            var feilds = document.querySelectorAll(DOMstring.inputDiscription + ',' + DOMstring.inputValue);
            //Convert List to Array
            var feildsArr = Array.prototype.slice.call(feilds)
            feildsArr.forEach(function(el){
                el.value = "";
            });
            feildsArr[0].focus();
        },
        budget : function(calout) {
            var type;
            if (calout.budget > 0) type = 'inc'
            else type = 'exp';
            document.querySelector(DOMstring.budgetLabel).textContent = formatMoney(calout.budget, type);
            document.querySelector(DOMstring.incomeLabel).textContent = formatMoney(calout.totalInc, 'inc');
            document.querySelector(DOMstring.expenseLabel).textContent = formatMoney(calout.totalExp, 'exp');
            if(calout.percent !== 0){
            document.querySelector(DOMstring.percentageLabel).textContent = calout.percent + '%';
            } else{
            document.querySelector(DOMstring.percentageLabel).textContent = calout.percent;
            }
        },
        deleteListItem : function(id){
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
        addListItem : function(item, type) {
            //Орлого зарлага хэтл бэлтгэнэ.
            var html, list;
            
            if(type === 'inc'){
                list = DOMstring.inputListInc;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$desc$$</div><div class="right clearfix"><div class="item__value">$$value$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else{
                list = DOMstring.inputListExp;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$desc$$</div><div class="right clearfix"><div class="item__value">$$value$$</div><div class="item__percentage">21</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            //Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглах өөрчилж өгнө.
            html = html.replace('%id%', item.id);
            html = html.replace('$$desc$$', item.description);
            html = html.replace('$$value$$', formatMoney(item.value, type));
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
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalInc){
        if(totalInc > 0){
        this.percentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.percentage = 0;
        }
    };
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    };
    var calculateTotal = function(type) {
        var sum = 0;
        data.items[type].forEach(function(el){
            sum = sum + el.value;
        });
        data.totals[type] = sum;
    };
    var data = {
        items : {
            inc : [],
            exp : [],
        },
        totals : {
            inc : -0,
            exp : -0,
        },  
        budget : 0,
        percent : 0,
    };
    return{
        cal : function(){
            // Нийт нийлбэрүүдийг тооцоолно.
            calculateTotal('inc');
            calculateTotal('exp');
            // Төсвийг тооцоолох
            data.budget = data.totals.inc - data.totals.exp;
            // орлого зарлагын хувийг тооцоолох.
            if(data.totals.inc > 0) {
            data.percent = Math.round((data.totals.exp / data.totals.inc)* 100);
            }else {
                data.percent = 0;
            }
        },
        calculatePercentages : function() {
            data.items.exp.forEach(function(el){
                el.calcPercentage(data.totals.inc);
            });
        },
        getPercentages : function() {
            var allPercentages = data.items.exp.map(function(el){
                return el.getPercentage();
            });
            return allPercentages;
        },
        eteItem : function(type, id) {
            var ids = data.items[type].map(function(el){
                return el.id;
            });
            console.log(ids);
            var index = ids.indexOf(id);
            if(index !== -1){
                data.items[type].splice(index, 1);
            }
        },
        calout : function(){
            return{
                budget : data.budget,
                percent : data.percent,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
            }
        },
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
// Далд хэсэг
var appController = (function(uiC, fnC) {
    var input = uiC.getInput();
    var ctrlAddItem = function() {  
        // Оруулах өгөгдийг дэлгэцнээс олж авна.
        var input = uiC.getInput();
        if (input.description !== '' && input.value !== false){
        // Олж авсан өгөгдлүүдээ санхүүд дамжуулна.
        var item = fnC.addItem(
            input.type,
            input.description,
            input.value
            );
        var calout = fnC.calout();
        // Олж авсан өгөгдлүүдээ тохирох хэсэгт гаргана.
        uiC.addListItem(item, input.type);
        uiC.clearFields();
        // Төсвийг шинээр тооцоолох.
        updatebudge();
    }};
    var updatebudge = function() {
        // Төсвийг тооцоолно.
        fnC.cal();
        // Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
        var calculator = fnC.calout();
        // Төсөвийн тооцоог дэлгэцэнд гаргана.
        uiC.budget(calculator);
        // Элментүүдийн хувийг тооцоолно.
        fnC.calculatePercentages();
        // Элментүүдийн хувийг хүлээж авна.
        var allPercentages = fnC.getPercentages();
        // Эдгээр хувийг дэлгэцнд гаргана.
        uiC.despleyPercentages(allPercentages);
    };
    var setupEventListners = function() {
    var DOM = uiC.getDOMstrings();
    // if(input.description !== "" && input.value !== 0){
    document.querySelector(DOM.inputBtn).addEventListener('click', function() {
        ctrlAddItem();
    });
    document.addEventListener('keypress', function(event) {
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
    document.querySelector(DOM.inputType).addEventListener('change', uiC.changeType)
    document.querySelector(DOM.containerDiv).addEventListener('click', function(event){
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(id){
            var arr = id.split("-");
            var type = arr[0];
            var itemId = parseInt(arr[1]);
            //1.Санхүүгийн тодулаас устгана.
            fnC.deleteItem(type, itemId);
            //2.Дэлгэцэн дээрээс нь устгана.
            uiC.deleteListItem(id);
            //3.Үлдэгдэл тооцоог шинчлэж харуулна.
            // Төсвийг шинээр тооцоолох.
            updatebudge();
        }
    });
};
    return {
    init : function() {
        console.log('Программ эхэллээ.');
        uiC.despleyDate();
        setupEventListners();
    }
    };
})(uiController, financeController);
appController.init();