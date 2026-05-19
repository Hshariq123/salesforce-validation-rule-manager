import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
function App() {

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {

    const loggedIn =
      localStorage.getItem('salesforceLoggedIn');

    if (loggedIn) {

      setIsLoggedIn(true);
    }

  }, []);
  const loginToSalesforce = () => {

    window.location.href =
      'https://salesforce-validation-rule-manager-ad6h.onrender.com/login';
  };
const logoutFromSalesforce = async () => {

  try {

    localStorage.removeItem(
      'salesforceLoggedIn'
    );

    setRules([]);

    setIsLoggedIn(false);

    window.location.href =
      'https://salesforce-validation-rule-manager-ad6h.onrender.com/logout';

  } catch (error) {

    console.log(error);
  }
};
  const fetchValidationRules = async () => {

    try {

      setLoading(true);

      const response = await axios.get(
        'https://salesforce-validation-rule-manager-ad6h.onrender.com/validation-rules'
      );

      setRules(response.data);
      setIsLoggedIn(true);
      localStorage.setItem(
        'salesforceLoggedIn',
        'true'
      );
    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  const toggleRule = async (rule) => {
    try {

      setLoading(true);

      await axios.post(
        'https://salesforce-validation-rule-manager-ad6h.onrender.com/toggle-rule',
        {
          fullName: rule.FullName,
          active: !rule.Active
        }
      );

      await fetchValidationRules();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };
  const toggleAllRules = async (activeState) => {
    try {

      setLoading(true);

      await axios.post(
        'https://salesforce-validation-rule-manager-ad6h.onrender.com/toggle-all',
        {
          active: activeState
        }
      );

      await fetchValidationRules();

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="app-container">

      <div className="header-section">

        <h1>Salesforce Validation Rule Manager</h1>

        <p>
          Manage Salesforce validation rules dynamically
        </p>

      </div>
      <div className="top-actions">

        {

          !isLoggedIn ? (

            <button
              className="primary-btn"
              onClick={loginToSalesforce}
              disabled={loading}
            >
              Login with Salesforce
            </button>

          ) : (

            <>

              <div className="action-row">

                <button
                  className="primary-btn"
                  onClick={fetchValidationRules}
                  disabled={loading}
                >
                  Fetch Validation Rules
                </button>

                <button
                  className="enable-btn"
                  onClick={() => toggleAllRules(true)}
                  disabled={loading}
                >
                  Enable All
                </button>

                <button
                  className="disable-btn"
                  onClick={() => toggleAllRules(false)}
                  disabled={loading}
                >
                  Disable All
                </button>

              </div>

              <div className="logout-section">

                <button
                  className="logout-btn"
                  onClick={logoutFromSalesforce}
                  disabled={loading}
                >
                  Logout
                </button>

              </div>

            </>

          )

        }

      </div>
      {
        loading && (
          <p className="loading-text">
            Processing Salesforce request...
          </p>
        )
      }
      <div className="table-container">

        <table>

          <thead>

            <tr>
              <th>Rule Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {rules.map((rule) => (

              <tr key={rule.Id}>

                <td>{rule.ValidationName}</td>

                <td>

                  <span
                    className={
                      rule.Active
                        ? 'active-status'
                        : 'inactive-status'
                    }
                  >
                    {rule.Active ? 'Active' : 'Inactive'}
                  </span>

                </td>

                <td>

                  <button
                    className={
                      rule.Active
                        ? 'disable-btn'
                        : 'enable-btn'
                    }
                    onClick={() => toggleRule(rule)} disabled={loading}
                  >
                    {rule.Active ? 'Disable' : 'Enable'}
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default App;