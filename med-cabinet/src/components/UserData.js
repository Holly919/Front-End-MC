import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";
import "./UserData.scss";

export default function Form() {
  const initialFormState = {
    zipCode: "",
    issue: "",
    effects: "",
    flavor: "",
    strain: "",
    type: "",
    intake: "",
  };

  const [post, setPost] = useState([]);

  const [serverError, setServerError] = useState("");

  const [formState, setFormState] = useState(initialFormState);

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [errors, setErrors] = useState(initialFormState);

  const formSchema = yup.object().shape({
    zipCode: yup.number().required().min(5),
    issue: yup.string().required("Must outline an issue"),
    effects: yup.string().required("Must detailed desired effects"),
    flavor: yup.string().required("Must state preferred flavor/s"),
    strain: yup.string().required("State preferred strain/s"),
    type: yup.string().required("State preferred type/s"),
    intake: yup.string().required("State preferred intake methods"),
  });

  const validateChange = (e) => {
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then((valid) => {
        setErrors({ ...errors, [e.target.name]: "" });
      })
      .catch((err) => {
        console.log("error!", err);
        setErrors({ ...errors, [e.target.name]: err.errors[0] });
      });
  };

  useEffect(() => {
    formSchema.isValid(formState).then((valid) => {
      console.log("valid?", valid);
      setIsButtonDisabled(!valid);
    });
  }, [formState, formSchema]);

  const submitForm = (e) => {
    e.preventDefault();

    axios
      .post("https://medcabinet2.herokuapp.com/auth/register", formState)
      .then((response) => {
        setPost(response.data);

        setFormState({
          zipCode: "",
          issue: "",
          effects: "",
          flavor: "",
          strain: "",
          type: "",
          intake: "",
        });

        setServerError(null);
      })
      .catch((err) => {
        setServerError("oops! something happened!");
      });
  };

  // onChange function
  const inputChange = (e) => {
    e.persist();
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    };
    validateChange(e);
    setFormState(newFormData);
  };

  return (
    <form id="userDataForm" onSubmit={submitForm}>
      <h2>What are you looking for?</h2>
      {serverError ? <p className="error">{serverError}</p> : null}

      <label htmlFor="zipCode">
        Zipcode
        <input
          id="zipCode"
          type="number"
          name="zipCode"
          placeholder="Enter Zip Code"
          onChange={inputChange}
          value={formState.zipcode}
        />
        {errors.zipCode.length > 0 ? (
          <p className="error">{errors.zipCode} </p>
        ) : null}
      </label>
      <label htmlFor="issue">
        Your Medical Issues
        <textarea
          name="issue"
          id="issue"
          placeholder="ex. Anxiety, Stress, Cancer, Back Pain, Migraines"
          onChange={inputChange}
          value={formState.issue}
        />
        {errors.issue.length > 0 ? (
          <p className="error">{errors.issue}</p>
        ) : null}
      </label>

      <label htmlFor="effects">
        Desired Treatment Effects
        <textarea
          name="effects"
          id="effects"
          placeholder="ex. Relaxed, Sleepy, Uplifted, Happy, Euphoric"
          onChange={inputChange}
          value={formState.effects}
        />
        {errors.effects.length > 0 ? (
          <p className="error">{errors.effects}</p>
        ) : null}
      </label>

      <label htmlFor="flavor">
        Preferred Flavors
        <textarea
          name="flavor"
          id="flavor"
          placeholder="ex. Flowery, Vanilla, Citrus, Pungent"
          onChange={inputChange}
          value={formState.flavor}
        />
        {errors.flavor.length > 0 ? (
          <p className="error">{errors.strain}</p>
        ) : null}
      </label>

      <label htmlFor="strain">
        Preferred Strain
        <textarea
          name="strain"
          id="strain"
          placeholder="ex. Qush, Girl Scout cookie, Pineapple Qush, Headband"
          onChange={inputChange}
          value={formState.strain}
        />
        {errors.strain.length > 0 ? (
          <p className="error">{errors.strain}</p>
        ) : null}
      </label>

      <label htmlFor="type">
        Preferred Type
        <textarea
          name="type"
          id="type"
          placeholder="ex. Indica, Hybrid, Sativa"
          onChange={inputChange}
          value={formState.type}
        />
        {errors.type.length > 0 ? <p className="error">{errors.type}</p> : null}
      </label>

      <label htmlFor="intake">
        Preferred method of intake/consumption.
        <textarea
          name="intake"
          id="intake"
          placeholder="ex. Vape, Edibles, Smoke, Topical"
          onChange={inputChange}
          value={formState.intake}
        />
        {errors.intake.length > 0 ? (
          <p className="error">{errors.intake}</p>
        ) : null}
      </label>

      <pre>{JSON.stringify(post, null, 2)}</pre>
      <button disabled={isButtonDisabled} type="submit">
        Submit
      </button>
    </form>
  );
}
