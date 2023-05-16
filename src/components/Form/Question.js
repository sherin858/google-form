import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Select from "react-select";
import { IoCheckbox, IoCloseOutline, IoRefresh } from "react-icons/io5";
import {
  MdShortText,
  MdOutlineRadioButtonChecked,
  MdClose,
} from "react-icons/md";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { FaCircle } from "react-icons/fa";
import {
  customStyles,
  customTheme,
  generateColor,
} from "../../services/service";

function Question({ surveyData, questionData, colors, questionTypes }) {
  const { questionIndex, question } = questionData;
  const { setSurveyChange } = surveyData;
  const [selectedOption, setSelectedOption] = useState(null); //selected answer type
  const option = {
    optionText: "",
    value: "",
    optionOrder: "",
    requireLabelingFlg: false,
    optionColor: "",
  };
  const [options, setOptions] = useState(null); //answer options

  //answers types options
  const optionKeyValue = (typeDescription) => {
    if (typeDescription === "text") {
      return (
        <div>
          <MdShortText /> Short answer
        </div>
      );
    } else if (typeDescription === "radio") {
      return (
        <div>
          <MdOutlineRadioButtonChecked /> Radio answer
        </div>
      );
    } else if (typeDescription === "checkbox") {
      return (
        <div>
          <IoCheckbox /> Checkboxes
        </div>
      );
    }
  };

  useEffect(() => {
    setOptions(
      questionTypes.map((type) => ({
        // value: type.code, //option value
        label: optionKeyValue(type), //text in select menu
        description: type, //answer type
      }))
    );
  }, []);

  //
  useEffect(() => {
    // by default chosen answer type set to radio
    if (options) {
      const radioOption = options.filter(
        (option) => option.description == "radio"
      );
      setSelectedOption(radioOption[0]);
      setSurveyChange("questionTypeId", radioOption[0].value, questionIndex); //method in parent component to handle field change
    }
  }, [options]);

  //handle fields change
  const handleChange = (e, i) => {
    const { name, value } = e.target;
    //not option field
    if (name != "possibleAnswer") {
      setSurveyChange(name, value, questionIndex);
    }
    //option field
    else {
      setSurveyChange(name, value, questionIndex, i);
    }
  };

  //handle change in selecting answer type
  const handleSelect = (e, questionTypeId) => {
    setSelectedOption(e);
    setSurveyChange("questionTypeId", e.value, questionIndex);
  };

  const toggleRequirement = (name, optionIndex) => {
    //toggle requireLabelingFlg key in question (set to opposite value)
    if (name === "requireLabelingFlg") {
      const obj = { ...surveyData.survey };
      obj.questions[questionIndex].options[optionIndex].requireLabelingFlg =
        !obj.questions[questionIndex].options[optionIndex].requireLabelingFlg;
      surveyData.setSurvey(obj);
    }
    //toggle required flag in question
    else {
      setSurveyChange(name, !question[name], questionIndex);
    }
  };

  const handleLabeling = (optionIndex) => {
    //generate option color
    if (question.options[optionIndex].requireLabelingFlg) {
      changeColor(optionIndex, true, false);
    }
    //remove option color if doesn't require labeling
    else {
      changeColor(
        optionIndex,
        false,
        question.options[optionIndex].optionColor
      );
    }
  };

  const changeColor = (optionIndex, change, removedColor) => {
    if (change) {
      let color = generateColor(); //method generates random color
      const isRepeated = colors.generatedColors.some(
        (generatedColor) => generatedColor === color
      ); // if color is generated by other question or option generate another color
      if (isRepeated) {
        changeColor(optionIndex, change, removedColor);
      }
      //if not repeated set option color in survey
      else {
        const obj = { ...surveyData.survey };
        obj.questions[questionIndex].options[optionIndex].optionColor = color;
        surveyData.setSurvey(obj);
        //if color required to be changed previous color is removed
        if (removedColor) {
          colors.setGeneratedColors([
            ...colors.generatedColors.filter((color) => color !== removedColor),
            color,
          ]);
        }
        //if new color added to list of generated colors
        else {
          colors.setGeneratedColors([...colors.generatedColors, color]);
        }
      }
    }
    //if option is toggled from require labeling to not requiring labeling remove color
    else {
      colors.setGeneratedColors([
        ...colors.generatedColors.filter((color) => color !== removedColor),
      ]);
      const obj = { ...surveyData.survey };
      obj.questions[questionIndex].options[optionIndex].optionColor = "";
      surveyData.setSurvey(obj);
    }
  };

  //adding new option to question answeres
  const newOption = () => {
    const arrayTwo = { ...surveyData.survey };
    arrayTwo.questions[questionIndex].options.push(option);
    const optionsLength = arrayTwo.questions[questionIndex].options.length;
    arrayTwo.questions[questionIndex].options[optionsLength - 1].optionOrder =
      optionsLength;
    surveyData.setSurvey(arrayTwo);
  };

  //removing existing option
  const removeOption = (e, index) => {
    let obj = { ...surveyData.survey };
    obj.questions[questionIndex].options.splice(index, 1);
    const optionsLength = obj.questions[questionIndex].options.length;
    for (let i = index; i < optionsLength; i++) {
      obj.questions[questionIndex].options[i].optionOrder = i + 1;
    }
    surveyData.setSurvey(obj);
  };

  return (
    <>
      <div className={`${styles.question} ${styles.container}`}>
        <div style={{ textAlign: "right", marginBottom: "0.25rem" }}>
          <button
            className="action"
            style={{ display: "inline" }}
            onClick={() => questionData.removeQuestion(questionIndex)}
          >
            <MdClose />
          </button>
        </div>
        <div className={styles.questionAndType}>
          <input
            type="text"
            name="text"
            value={question.text}
            onChange={handleChange}
          />
          <Select
            isSearchable={false}
            styles={customStyles}
            theme={customTheme}
            value={selectedOption}
            options={options}
            isOptionDisabled={(option) => option.isDisabled == true}
            onChange={(e) => handleSelect(e, "answerType")}
            className={styles.select}
          />
        </div>
        <div>
          {question.options.map((option, index) => {
            if (selectedOption && selectedOption.description != "text") {
              return (
                <div key={index} className={styles.answer}>
                  <div className={styles.multiOptions}>
                    <input type={selectedOption.description} disabled />
                    <input
                      type="text"
                      name="possibleAnswer"
                      value={question.options[index].optionText}
                      onChange={(e) => handleChange(e, index)}
                      placeholder={`option ${index + 1}`}
                    />
                    {question.options.length !== 1 && (
                      <button
                        className={`action`}
                        onClick={(e) => removeOption(e, index)}
                      >
                        <IoCloseOutline />
                      </button>
                    )}
                    <button
                      className="action"
                      value={question.options[index].requireLabelingFlg}
                      onClick={() => {
                        toggleRequirement("requireLabelingFlg", index);
                        handleLabeling(index);
                      }}
                    >
                      {!question.options[index].requireLabelingFlg ? (
                        <BsToggleOff />
                      ) : (
                        <BsToggleOn />
                      )}
                    </button>
                    {option.requireLabelingFlg && (
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ color: `#${option.optionColor}` }}>
                          <FaCircle />
                        </div>
                        <button
                          style={{ cursor: "pointer", fontSize: "1.25rem" }}
                          className="action"
                          onClick={() => {
                            changeColor(index, true, option.optionColor);
                          }}
                        >
                          <IoRefresh />
                        </button>
                      </div>
                    )}
                  </div>
                  {index == question.options.length - 1 && (
                    <div
                      className={styles.multiOptions}
                      style={{ width: "100px" }}
                    >
                      <input type={selectedOption.description} disabled />
                      <input
                        type="text"
                        onClick={newOption}
                        placeholder="Add Option"
                        style={{ width: "100px" }}
                      />
                    </div>
                  )}
                </div>
              );
            }
          })}
          {selectedOption && selectedOption.description == "text" && (
            <input
              type={selectedOption.description}
              disabled
              name=""
              placeholder="Text answer"
              style={{ height: "2rem", marginTop: "1rem" }}
            />
          )}
        </div>
        <div>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span>Required</span>
              <button
                className="action"
                value={question.mandatoryFlg}
                onClick={() => toggleRequirement("mandatoryFlg")}
              >
                {!question.mandatoryFlg ? <BsToggleOff /> : <BsToggleOn />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Question;