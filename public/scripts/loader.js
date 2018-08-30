

/*

Loader(oDebug, oApi)
Loader::Init()
Loader::LoadXMLQuizzes()
Loader::LoadXMLQuizzesFromUrl(url)

*/


//
(function(){

  //  Our convention: use "window.App"
  if ( !window.App ) {
    window.App = {};
  }

  //  Import pointers
  var $ = window.$;

  //  Loader(oDebug, oApi)
  var Loader = function Loader(oDebug, oApi) {

    //
    this.debug = oDebug;
    this.api = oApi;
  };

  //  Loader::Init()
  Loader.prototype.Init = function Init() {
    //  Nada
  };

  //  Loader::LoadXMLQuizzes()
  Loader.prototype.LoadXMLQuizzes = function LoadXMLQuizzes() {

    //
    var oThis = this;

    //
    var files = [
      "star-wars-prequils.xml",
      "what-kind-of-person-are-you.xml"
    ];

    //
    $.each(files, function(index, file){

      //
      oThis.LoadXMLQuizzesFromUrl("/sample-data/" + file);
    });
  };

  //  Loader::LoadXMLQuizzesFromUrl(url)
  Loader.prototype.LoadXMLQuizzesFromUrl = function LoadXMLQuizzesFromUrl(url) {

    //
    var oThis = this;

    //
    $.ajax({

      //
      "url"     : url,
      "method"  : "GET",
      "success" : function LoadXMLQuizzes_OnSuccess(data /*, textStatus, jqXHR */ ) {

        //
        var xml_document = data;
        var $xml = $(xml_document);

        //
        $xml.find("quizzes quiz").each(function() {

          //
          var $quiz = $(this);
          var quiz_data = {};

          //
          quiz_data["title"] = $.trim($quiz.find("title").first().text());
          quiz_data["description"] = $.trim($quiz.find("description").first().text().replace(/\\n/g, "\n"));

          //
          quiz_data["questions"] = {};
          $quiz.find("question").each(function() {

            //
            var $question = $(this);
            var question = {
              "title": $.trim($question.find("title").first().text()),
              "text": $.trim($question.find("text").first().text().replace(/\\n/g, "\n")),
              "index": Object.keys(quiz_data["questions"]).length
            };

            //
            question["answers"] = {};
            $question.find("answer").each(function() {

              //
              var $answer = $(this);
              var answer = {
                "text": $.trim($answer.find("text").first().text().replace(/\\n/g, "\n")),
                "attribute_modifiers": $.trim($answer.find("attribute_modifiers").first().text()),
                "index": Object.keys(question["answers"]).length
              };

              //
              question["answers"][answer["index"]] = answer;
            });

            //
            quiz_data["questions"][question["index"]] = question;
          });

          //
          quiz_data["characters"] = {};
          $quiz.find("characters character").each(function() {

            //
            var $character = $(this);
            var character = {
              "title": $.trim($character.find("title").first().text()),
              "description": $.trim($character.find("description").first().text().replace(/\\n/g, "\n")),
              "attributes": $.trim($character.find("attributes").first().text())
            };

            //
            var index = Object.keys(quiz_data["characters"]).length;
            quiz_data["characters"][index] = character;
          });

          //
          oThis.api.CreateNewQuiz(quiz_data);
        });
      },

      "error"       : function LoadXMLQuizzes_OnError( jqXHR, textStatus, errorThrown ){

        //
        alert("Error while retrieving \"" + url + "\": " + textStatus + "\n\n" + errorThrown);
      },

      "complete"    : function LoadXMLQuizzes_OnComplete(){

        //
        //console.log("LoadXMLQuizzes_OnComplete()");
      }
    });
  };

  //  API::ResetEverything()
  Loader.prototype.ResetEverything = function ResetEverything() {

    //  Purge all data
    this.api.PurgeAllData();

    //  Load from default XMLs
    this.LoadXMLQuizzes();
  };

  //  Add our new class definition to the App
  window.App.Loader = Loader;

})();
