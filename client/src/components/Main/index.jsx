// frontend/src/components/Profile.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBIcon,
  MDBCardBody, MDBCardImage, MDBTypography
} from 'mdb-react-ui-kit';
import './Profile.css';  // Importing Custom CSS

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    Contact_Number: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          age: response.data.age,
          Contact_Number: response.data.Contact_Number,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setIsChangingPassword(false);
  };

  const handleChangePassword = () => {
    setIsChangingPassword(true);
    setIsEditing(false);
  };

  const handleChange = ({ currentTarget: input }) => {
    setFormData({ ...formData, [input.name]: input.value });
  };

  const handlePasswordChange = ({ currentTarget: input }) => {
    setPasswordData({ ...passwordData, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(formData.Contact_Number)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }
    try {
      const response = await axios.put(
        "/api/users/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUserData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.put(
        "/api/users/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          email: userData.email,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(response.data.message);
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert("Current password is incorrect. Please try again.");
        } else if (error.response.status === 404) {
          alert("User not found. Please check your email.");
        } else {
          console.error("Error updating user password:", error);
          alert("Something went wrong. Please try again later.");
        }
      } else {
        console.error("Error updating user password:", error);
        alert("Network error. Please check your connection.");
      }
    }
  };
  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <MDBContainer className="profile-container">
      <MDBRow className="justify-content-center">
        <MDBCol lg="6">
          <MDBCard className="profile-card">
            <MDBRow className="g-0">
              {/* Left Section - Profile */}
              <MDBCol md="4" className="profile-left">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                  alt="Avatar"
                  className="profile-img"
                  fluid
                />
                <MDBTypography tag="h5" className="profile-name">
                  {userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}
                </MDBTypography>
              
			
                <svg className="edit-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16" onClick={handleEdit}>
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
				{!isChangingPassword && !isEditing && (
					   <div>
						<button className="button" onClick={handleChangePassword}>Change Password</button>
					   </div>
					)}
              </MDBCol>

              {/* Right Section - Information */}
              <MDBCol md="8">
                <MDBCardBody className="profile-info">
                  <MDBTypography tag="h2" className="info-title">Profile</MDBTypography>
                  <hr className="divider" />

                  <MDBRow className="info-row">
                    <MDBCol size="6">
                      <MDBTypography tag="h5">Email</MDBTypography>
                      <MDBCardText className="text-muted">{userData ? userData.email : "Loading..."}</MDBCardText>
                    </MDBCol>
                    <MDBCol size="6">
                      <MDBTypography tag="h5">Phone</MDBTypography>
                      <MDBCardText className="text-muted">
                        {isEditing ? (
                          <input type="number" name="Contact_Number" value={formData.Contact_Number} onChange={handleChange} />
                        ) : (
                          userData ? userData.Contact_Number : "Loading..."
                        )}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>

                  {/* Details Section */}
                  <MDBTypography tag="h6" className="info-title">Details</MDBTypography>
                  <hr className="divider" />

                  <MDBRow className="info-row2">
                    <MDBCol size="6">
                      <MDBTypography tag="h5">First Name</MDBTypography>
                      <MDBCardText className="text-muted">
                        {isEditing ? (
                          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                        ) : (
                          userData ? userData.firstName : "Loading..."
                        )}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol size="6">
                      <MDBTypography tag="h5">Last Name</MDBTypography>
                      <MDBCardText className="text-muted">
                        {isEditing ? (
                          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                        ) : (
                          userData ? userData.lastName : "Loading..."
                        )}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol size="6">
                      <MDBTypography tag="h5">Age</MDBTypography>
                      <MDBCardText className="text-muted">
                        {isEditing ? (
                          <input type="number" name="age" value={formData.age} onChange={handleChange} />
                        ) : (
                          userData ? userData.age : "Loading..."
                        )}
                      </MDBCardText>
                    </MDBCol>
                  </MDBRow>

                  {/* Social Icons
                  <div className="social-links">
                    <a href="#!" className="social-icon"><MDBIcon fab icon="facebook" /></a>
                    <a href="#!" className="social-icon"><MDBIcon fab icon="twitter" /></a>
                    <a href="#!" className="social-icon"><MDBIcon fab icon="instagram" /></a>
                  </div> */}

                  {/* Edit and Change Password Buttons */}
                  {/* {!isChangingPassword && !isEditing && (
                    <div>
                      
                      <button type="button" onClick={handleChangePassword}>Change Password</button>
                    </div>
                  )} */}

                  {/* Save Button for Editing */}
                  {isEditing && (
                    <div>
                      <button type="button" onClick={handleSubmit}>Save</button>
                    </div>
                  )}

                  {/* Change Password Form */}
                  {isChangingPassword && (
                    
                    
                    <div>
                      <form onSubmit={handlePasswordSubmit}>
                        <p className = "Password">Current Password: <input type ="password" className="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} /></p>
                        <p className = "Password">New Password: <input type = "password" className="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} /></p>
                        <p className = "Password">Confirm New Password: <input type = "password" className="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} /></p>
                        <button className = "submit"type="submit">Change Password</button>
						<button type="button" onClick={handleCancelPasswordChange} className="cancel-btn">Cancel</button>
                      
                      </form>
                    </div>
                  )}
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Profile;
