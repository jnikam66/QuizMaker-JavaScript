(function() {

  //  Grab pointers
  var $ = window.$;

  //  Instantiate our modules
  var debug = new window.App.Debug();
  var api = new window.App.API(debug);
  var attributeHelper = new window.App.AttributeHelper(debug);
  var loader = new window.App.Loader(debug, api);
  var makeQuiz = new window.App.MakeQuiz(debug, api, attributeHelper);
  var takeQuiz = new window.App.TakeQuiz(debug, api, attributeHelper);
  var pageMode = new window.App.PageMode(debug, api);
  var autofiller = new window.App.AutoFiller(debug, pageMode, makeQuiz, takeQuiz);

  //  Let circularly dependent modules know about each other
  debug.SetApi(api);
  debug.SetLoader(loader);
  debug.SetPageMode(pageMode);
  makeQuiz.SetPageMode(pageMode);
  takeQuiz.SetPageMode(pageMode);
  pageMode.SetMakeQuiz(makeQuiz);
  pageMode.SetTakeQuiz(takeQuiz);

  //  Initialize all classes
  debug.Init();
  api.Init();
  loader.Init();
  makeQuiz.Init();
  takeQuiz.Init();
  pageMode.Init();
  autofiller.Init();

  //  Unhide anything hidden until hideUntilLoad
  $(".hideUntilLoad").each(function() {
    $(this).show();
  });
  $("#services").show();


})();
