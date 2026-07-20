import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const reduxUser = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    address: "",
    pincode: "",
  });

  const fillProfileData = (userData) => {
    if (!userData) return;

    setUser((prev) => ({
      ...prev,
      fullName:
        userData.fullName ||
        userData.name ||
        `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
        "",
      email: userData.email || "",
      mobile:
        userData.mobile ||
        userData.contactNumber ||
        userData.phone ||
        "",
      gender:
        userData.gender ||
        userData.additional_details?.gender ||
        "",
      address:
        userData.address?.[0]?.address ||
        userData.address?.[0]?.fullAddress ||
        userData.address ||
        "",
      pincode:
        userData.pincode ||
        userData.address?.[0]?.pincode ||
        "",
    }));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (reduxUser) {
      fillProfileData(reduxUser);
    } else if (storedUser) {
      try {
        fillProfileData(JSON.parse(storedUser));
      } catch (error) {
        console.log("Local user parse error:", error);
      }
    }
  }, [reduxUser]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("Token not found");
          return;
        }

        const response = await fetch("https://api.onstage.co.in/api/v1/me", {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

  

        const data = await response.json();
        console.log("PROFILE USER API:", data);

        const apiUser =
          data?.user ||
          data?.data ||
          data?.checkUserPresent ||
          data?.loggedInUser;

        if (apiUser) {
          fillProfileData(apiUser);
        }
      } catch (error) {
        console.log("Profile API Error:", error);
      }
    };

    getUser();
  }, []);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://api.onstage.co.in/api/v1/update-profile",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: user.fullName,
            email: user.email,
            mobile: user.mobile,
            gender: user.gender,
            address: user.address,
            pincode: user.pincode,
          }),
        }
      );

      const data = await response.json();
      console.log("UPDATE PROFILE:", data);

      if (data.success) {
        alert("Profile Updated ✅");
      } else {
        alert(data.message || "Update failed ❌");
      }
    } catch (error) {
      console.log(error);
      alert("Unable to connect to server ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pf-container">
      <video autoPlay loop muted className="pf-bg-video">
        <source src="https://pub-ea72df14e59d4f28ad52b8d1ac0153ef.r2.dev/6266-190550868_medium.mp4" />
      </video>

      <div className="pf-box">
        <img
          src="https://res.cloudinary.com/dfilhi9ku/image/upload/v1758112097/Onstage-Logo-2019-2_2_pvggfn.png"
          className="pf-logo"
          alt="Logo"
        />

        <h2 className="pf-title">My Profile Settings</h2>

        <form onSubmit={handleUpdate}>
          <div className="pf-grid">
            <div>
              <div className="pf-field">
                <input
                  className="pf-input"
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={user.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="pf-field">
                <input
                  className="pf-input"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={user.email}
                  onChange={handleChange}
                />
              </div>

              <div className="pf-field">
                <input
                  className="pf-input"
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={user.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="pf-field">
                <select
                  className="pf-input"
                  name="gender"
                  value={user.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pf-field">
                <input
                  className="pf-input"
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={user.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className="pf-field">
                <textarea
                  className="pf-input pf-textarea"
                  name="address"
                  placeholder="Address"
                  value={user.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button className="pf-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}