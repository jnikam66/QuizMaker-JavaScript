

/*

API(oDebug)
API::Init()
API::HandleError(error)
API::PurgeAllData()
API::ResetEverything()
API::CreateNewQuiz(quiz, callback)
API::CreateQuizQuestions(quiz_id, questions, callback)
API::CreateQuizQuestionAnswers(quiz_id, question_id, answers, callback)
API::CreateQuizResultCharacters(quiz_id, characters, callback)
API::GetAllQuizzes(callback)
API::GetQuiz(quiz_id, callback)
API::GetQuizQuestions(quiz_id, callback)
API::GetQuizResultCharacters(quiz_id, callback)

*/

(function(){

  //  Our convention is: window.App.[module_name]
  if ( !window.App ) {
    window.App = {};
  }

  //  Grab pointers
  var $ = window.$;
  var dpd = window.dpd;

  //  Start API Class Definition
  var API = function(oDebug){

    //
    this.debug = oDebug;
  };

  //  API::Init()
  API.prototype.Init = function Init() {
    //  Nada
  };

  //  API::HandleError(error)
  API.prototype.HandleError = function HandleError(error) {

    //
    var error_body;

    //
    if ( error.message ) {
      error_body = error.message;
    }
    else if ( error.errors) {
      error_body = JSON.stringify(error.errors, null, 2);
    }
    else{
      error_body = "{Unable to parse API error}";
    }

    //
    this.debug.DoError("Deployd API Error " + error.status + "\n\n" + error_body);
  };

  //  API::PurgeAllData()
  API.prototype.PurgeAllData = function PurgeAllData() {

    //
    var oThis = this;

    //  Delete all quizzes
    dpd.quizzes.get(function(results, error) {

      //
      if (error) {
        oThis.HandleError(error);
        return false;
      }

      //
      $.each(results, function(index, result) {
        dpd.quizzes.del(result["id"], function(result, error) {

          //
          if (error) {
            oThis.HandleError(error);
            return false;
          }
        });
      });
    });

    //  Delete all quiz questions
    dpd.quizquestions.get(function(results, error) {

      //
      if (error) {
        oThis.HandleError(error);
        return false;
      }

      //
      $.each(results, function(index, result) {
        dpd.quizquestions.del(result["id"], function(result, error) {

          //
          if (error) {
            oThis.HandleError(error);
            return false;
          }

        });
      });
    });

    //  Delete all quiz questions answers
    dpd.quizquestionanswers.get(function(results, error) {

      //
      if (error) {
        oThis.HandleError(error);
        return false;
      }

      //
      $.each(results, function(index, result) {
        dpd.quizquestionanswers.del(result["id"], function(result, error) {

          //
          if (error) {
            oThis.HandleError(error);
            return false;
          }

        });
      });
    });

    //  Delete all quiz result characters
    dpd.quizresultcharacters.get(function(results, error) {

      //
      if (error) {
        oThis.HandleError(error);
        return false;
      }

      //
      $.each(results, function(index, result) {
        dpd.quizresultcharacters.del(result["id"], function(result, error) {

          //
          if (error) {
            oThis.HandleError(error);
            return false;
          }

        });
      });
    });
  };

  //  API::CreateNewQuiz(quiz, callback)
  API.prototype.CreateNewQuiz = function CreateNewQuiz(quiz, callback) {

    //
    var oThis = this;

    //  Create the quiz on the server
    var data_quiz = {
      "title": quiz["title"],
      "description": quiz["description"]
    };
    dpd.quizzes.post(data_quiz, function(quiz_created, error) {

      //
      if (error) {
        oThis.HandleError(error);
        return false;
      }

      //  We have our new quiz object, so now create all its questions
      oThis.CreateQuizQuestions(quiz_created["id"], quiz["questions"], function() {

        //  Now that the questions are done, create the character results
        oThis.CreateQuizResultCharacters(quiz_created["id"], quiz["characters"], function() {

          //  We're done; Call the callback
          //  callback(error)
          if (callback) {
            callback(null);
          }
        });
      });
    });
  };

  //  API::CreateQuizQuestions(quiz_id, questions, callback)
  API.prototype.CreateQuizQuestions = function CreateQuizQuestions(quiz_id, questions, callback) {

    //
    var oThis = this;

    //
    $.each(questions, function(question_index, question) {

      //
      var data_question = {
        "quizid": quiz_id,
        "title": question["title"],
        "text": question["text"],
        "index": question["index"]
      };
      dpd.quizquestions.post(data_question, function(question_created, error) {

        //
        if (error) {
          oThis.HandleError(error);
          return false;
        }

        //  Now create all the answers for this question
        oThis.CreateQuizQuestionAnswers(quiz_id, question_created["id"], question["answers"], function() {

          //  Coming back from the last question's answers? Call the callback
          if (question_index == Object.keys(questions).length - 1) {
            if (callback) {
              callback();
            }
          }
        });
      });
    });
  };

  //  API::CreateQuizQuestionAnswers(quiz_id, question_id, answers, callback)
  API.prototype.CreateQuizQuestionAnswers = function CreateQuizQuestionAnswers(quiz_id, question_id, answers, callback) {

    //
    var oThis = this;

    //
    $.each(answers, function(answer_index, answer) {

      //
      var data_answer = {
        "quizid": quiz_id,
        "quizquestionid": question_id,
        "index": answer["index"],
        "text": answer["text"],
        "attributemodifiers": answer["attribute_modifiers"]
      };
      dpd.quizquestionanswers.post(data_answer, function(answer_created, error) {

        //
        if (error) {
          oThis.HandleError(error);
          return false;
        }

        //  Last answer? Call the callback
        if (answer_index == Object.keys(answers).length - 1) {
          if (callback) {
            callback();
          }
        }
      });
    });
  };

  //  API::CreateQuizResultCharacters(quiz_id, characters, callback)
  API.prototype.CreateQuizResultCharacters = function CreateQuizResultCharacters(quiz_id, characters, callback) {

    //
    var oThis = this;

    //  Next, create all the result characters
    $.each(characters, function(character_index, character) {

      //
      var data_character = {
        "quizid": quiz_id,
        "title": character["title"],
        "description": character["description"],
        "attributes": character["attributes"]
      };
      dpd.quizresultcharacters.post(data_character, function(character_created, error) {

        //
        if (error) {
          oThis.HandleError(error);
          return false;
        }

        //  Finally, we are successful, and are on the last character,
        //  we can call the callback
        if (character_index == Object.keys(characters).length - 1) {
          if (callback) {
            callback();
          }
        }

      });
    });
  };

  //  API::GetAllQuizzes(callback)
  API.prototype.GetAllQuizzes = function GetAllQuizzes(callback) {

    //
    var oThis = this;

    //
    dpd.quizzes.get(function(quizzes, error){

      //
      if (error) {
        oThis.HandleError(error);
        return false;
      }

      //
      callback(quizzes);
    });
  };

  //  API::GetQuiz(quiz_id, callback)
  API.prototype.GetQuiz = function GetQuiz(quiz_id, callback) {

    //
    var oThis = this;

    //  Grab the quiz
    dpd.quizzes.get(quiz_id, function(quiz, error){

      //
      if (error) {
        oThis.HandleError(error);
        return false;
      }

      //  Grab all questions
      oThis.GetQuizQuestions(quiz["id"], function(questions){

        //
        quiz["questions"] = questions;

        //  Grab all result characters
        oThis.GetQuizResultCharacters(quiz["id"], function(characters){

          //
          quiz["characters"] = characters;

          //
          callback(quiz);
        });
      });

    });
  };

  //  API::GetQuizQuestions(quiz_id, callback)
  API.prototype.GetQuizQuestions = function GetQuizQuestions(quiz_id, callback) {

    //
    var oThis = this;

    //
    var query_questions = {
      "quizid"      : quiz_id
    };
    dpd.quizquestions.get(query_questions, function(api_questions, error){

      //
      if (error) {
        oThis.HandleError(error);
        return false;
      }

      //  Build a query such that we can grab all answers at once
      var questions = [];
      var question_ids = [];
      $.each(api_questions, function(question_index, question){
        question["answers"] = [];
        questions[question["index"]] = question;  //  Order by index
        question_ids.push(question["id"]);
      });
      var query_answers = {
        "quizquestionid"  : {"$in" : question_ids}
      };
      dpd.quizquestionanswers.get(query_answers, function(answers, error){

        //
        if (error) {
          oThis.HandleError(error);
          return false;
        }

        //  Add each answer into its corresponding question
        //  Thank goodness jQuery passes references lol
        $.each(answers, function(answer_index, answer){
          $.each(questions, function(question_index, question){
            if ( answer["quizquestionid"] == question["id"] ) {
              question["answers"][answer["index"]] = answer;
            }
          });
        });

        //  Return to caller
        callback(questions);
      });

    });
  };

  //  API::GetQuizResultCharacters(quiz_id, callback)
  API.prototype.GetQuizResultCharacters = function GetQuizResultCharacters(quiz_id, callback) {

    //
    var oThis = this;

    //
    var query_characters = {
      "quizid"      : quiz_id
    };
    dpd.quizresultcharacters.get(query_characters, function(api_characters, error){

      //
      if (error) {
        oThis.HandleError(error);
        return false;
      }

      //
      callback(api_characters);
    });
  };

  //  Add the API class to our main window app
  window.App.API = API;

})();
