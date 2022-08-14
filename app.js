// desktop Controller
var uiController = (function() {
    
})();
// Finance Controller
var financeController = (function() {

})();

var appController = (function(uiC, fnC) {
    var ctrlAddItem = function() {
        // Оруулах өгөгдийг дэлгэцнээс олж авна.
        // Олж авсан өгөгдлүүдээ санхүүд дамжуулна.
        // Олж авсан өгөгдлүүдээ тохирох хэсэгт гаргана.
        // Төсбийг тооцоолно.
        // Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
    };

    document.querySelector('.add__btn').addEventListener('click' function() {
        ctrlAddItem();
    });
    document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }
    });
})(uiController, financeController);