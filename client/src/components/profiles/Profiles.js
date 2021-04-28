import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import ProfileItem from './ProfileItem'
import { getProfiles } from '../../actions/profilesActions';

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profiles, loading } = this.props.profile;
    let profilesItems;

    if (profiles === null || loading) {
      profilesItems = <Spinner />
    } else {
      if (profiles.length > 0) {
        profilesItems = profiles.map(profile => (
          <ProfileItem key={profile._id} profile={profile} />
        ))
      } else {
        profilesItems = <h4>No profiles found...</h4>
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Developer Profiles</h1>
                <p className="lead text-center">
                  Browse and connect with developers
                </p>
                {profilesItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);
