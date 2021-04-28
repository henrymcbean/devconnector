import React, { Component } from "react";
import Moment from "react-moment";
import isEmpty from "../../validation/is-empty";

class ProfileCreds extends Component {
  render() {
    const { education, experience } = this.props;

    let expListItems, eduListItem;

    expListItems = experience.map(exp => (
      <li key={exp._id} className="list-group-item">
        <h4>{exp.company}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{exp.from}</Moment>
          {" - "}
          {exp.to === null ? (
            "Current"
          ) : (
            <Moment format="YYYY/MM/DD">{exp.to}</Moment>
          )}
        </p>
        <p>
          <span>
            <strong>Position: </strong>
            {exp.title}
          </span>
        </p>
        {isEmpty(
          exp.location ? null : (
            <p>
              <span>
                <strong>Location:</strong>
                {exp.location}
              </span>
            </p>
          )
        )}
        {isEmpty(exp.description) ? null : (
          <p>
            <span>
              <strong>Description: </strong>
              {exp.description}
            </span>
          </p>
        )}
      </li>
    ));

    eduListItem = education.map(edu => (
      <li key={edu._id} className="list-group-item">
        <h4>{edu.school}</h4>
        <p>
          <Moment format="YYYY/MM/DD">{edu.from}</Moment>
          {" - "}
          {edu.to === null ? (
            "Current"
          ) : (
            <Moment format="YYYY/MM/DD">{edu.to}</Moment>
          )}
        </p>
        <p>
          <span>
            <strong>Degree: </strong>
            {edu.degree}
          </span>
        </p>
        <p>
          <span>
            <strong>Field Of Study: </strong>
            {edu.fieldofstudy}
          </span>
        </p>
        {isEmpty(edu.description) ? null : (
          <p>
            <span>
              <strong>Description: </strong>
              {edu.description}
            </span>
          </p>
        )}
      </li>
    ));

    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          {expListItems.length > 0 ? (
            <ul className="list-group">{expListItems}</ul>
          ) : (
            <p className="text-center">No Experience Listed</p>
          )}
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          {eduListItem.length > 0 ? (
            <ul className="list-group">{eduListItem}</ul>
          ) : (
            <p className="text-center">No Education Listed.</p>
          )}
        </div>
      </div>
    );
  }
}

export default ProfileCreds;
