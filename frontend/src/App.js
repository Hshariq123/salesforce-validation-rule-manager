import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [rules, setRules] = useState([]);

  const loginToSalesforce = () => {
    window.location.href = 'https://salesforce-validation-rule-manager-ad6h.onrender.com/login';
  };

  const fetchValidationRules = async () => {

    try {

      const response = await axios.get(
        'https://salesforce-validation-rule-manager-ad6h.onrender.com/validation-rules'
      );

      setRules(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const toggleRule = async (rule) => {

    try {

      await axios.post(
        'https://salesforce-validation-rule-manager-ad6h.onrender.com/toggle-rule',
        {
          fullName: rule.FullName,
          active: !rule.Active
        }
      );

      fetchValidationRules();

    } catch (error) {

      console.log(error);
    }
  };

  const toggleAllRules = async (activeState) => {

    try {

      await axios.post(
        'https://salesforce-validation-rule-manager-ad6h.onrender.com/toggle-all',
        {
          active: activeState
        }
      );

      fetchValidationRules();

    } catch (error) {

      console.log(error);
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

      <div className="button-group">

        <button
          className="primary-btn"
          onClick={loginToSalesforce}
        >
          Login with Salesforce
        </button>

        <button
          className="primary-btn"
          onClick={fetchValidationRules}
        >
          Fetch Validation Rules
        </button>

        <button
          className="enable-btn"
          onClick={() => toggleAllRules(true)}
        >
          Enable All
        </button>

        <button
          className="disable-btn"
          onClick={() => toggleAllRules(false)}
        >
          Disable All
        </button>

      </div>

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
                    onClick={() => toggleRule(rule)}
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