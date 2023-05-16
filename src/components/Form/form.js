import React, { useState } from "react";
import Question from "./Question";
import styles from "./styles.module.css";
import { IoArrowDown, IoSend } from "react-icons/io5";
import Select from "react-select";
import { customStyles, customTheme } from "../../services/service";

function Form() {
  const [questionsNumber, setQuestionsNumber] = useState(1); //number of questions
  const [survey, setSurvey] = useState({
    surveyTitle: "Untitled survey",
    treeTypeDesc: "string",
    treeTypeId: "",
    questions: [
      {
        text: "Untitled Question",
        questionOrder: 1,
        color: "string",
        options: [
          {
            optionText: "",
            value: "",
            optionOrder: 1,
            requireLabelingFlg: false,
            optionColor: "",
          },
        ],
        questionTypeId: "",
        mandatoryFlg: false,
      },
    ],
  }); //final survey
  const [generatedColors, setGeneratedColors] = useState([]); //colors of all options
  const questionTypes = ["text", "radio", "checkbox"]; //answer types (radio,text,checkbox..)
  // const [treeTypes,setTreeTypes]=useState(null); //tree types
  // const [sendSurvey,setSendSurvey]=useState(false); //true when ready to send survey
  // const [treeTypesOptions,setTreeTypesOptions]=useState(null);//options of react-select
  const [selectedOption, setSelectedOption] = useState(null); //react-select chosen option
  // const [isLoading,setIsLoading]=useState(true) //true when loading data from endpoint
  // const alertRef=useRef(null);
  // const {id}=useParams();//exists when edit survey mode

  //handle change in selected tree type
  const handleSelect = (e) => {
    setSelectedOption(e);
    setSurvey({ ...survey, treeTypeId: `${e.value}` });
  };

  //handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurvey({ ...survey, [name]: value });
  };
  //add new question to survey
  const newQuestion = () => {
    setQuestionsNumber((prev) => prev + 1);
    setSurvey({
      ...survey,
      questions: [
        ...survey.questions,
        {
          text: "Untitled Question",
          questionOrder: questionsNumber + 1,
          options: [
            {
              optionText: "",
              value: "",
              optionOrder: 1,
              requireLabelingFlg: false,
              optionColor: "",
            },
          ],
          questionTypeId: "",
          mandatoryFlg: false,
        },
      ],
    });
  };

  //remove question from survey
  const removeQuestion = (questionIndex) => {
    const obj = { ...survey };
    obj.questions.splice(questionIndex, 1);
    setQuestionsNumber((prev) => prev - 1);
    //replacing order for questions after that question
    for (let i = questionIndex; i < obj.questions.length; i++) {
      obj.questions[i].questionOrder = i + 1;
    }
    setSurvey(obj);
  };
  const setSurveyChange = (name, value, questionIndex, optionIndex) => {
    const surveyData = { ...survey };
    //if field is not related to question options
    if (name != "possibleAnswer") {
      surveyData.questions[questionIndex][name] = value;
    } else {
      surveyData.questions[questionIndex].options[optionIndex].optionText =
        value;
    }
    setSurvey(surveyData);
  };

  return (
    <div style={{ marginBottom: "3rem" }}>
      <div className={`${styles.surveyInfo} ${styles.container}`}>
        <input
          type="text"
          onChange={handleChange}
          value={survey.surveyTitle}
          name="surveyTitle"
          style={{ fontSize: "2rem" }}
        />
      </div>
      <div className={styles.container}></div>
      {survey.questions.map((question, index) => {
        return (
          <Question
            key={index}
            questionTypes={questionTypes}
            questionData={{ question, questionIndex: index, removeQuestion }}
            colors={{ generatedColors, setGeneratedColors }}
            surveyData={{ survey, setSurvey, setSurveyChange }}
          />
        );
      })}
      <div style={{ textAlign: "center" }}>
        <button
          className="btn"
          style={{ marginRight: "1rem" }}
          onClick={newQuestion}
        >
          <IoArrowDown /> Add question
        </button>
        <button className="btn">
          <IoSend /> Send Survey
        </button>
      </div>
    </div>
  );
}

export default Form;
