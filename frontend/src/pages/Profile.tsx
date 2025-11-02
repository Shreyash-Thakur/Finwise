import React, { useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { user as seedUser } from '../data/seed';
import { totalInvested } from '../data/derived';
import { fmtINR } from '../utils/formatters';
export function Profile() {
  const [user, setUser] = useState(seedUser);
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState({
    newsletter: true,
    alerts: true,
    weeklyReport: false
  });
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  const profileTab = <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Personal Information
        </h3>
        <div className="space-y-4">
          <Input label="Full Name" value={user.name} onChange={e => setUser({
          ...user,
          name: e.target.value
        })} />
          <Input label="Email Address" type="email" value={user.email} onChange={e => setUser({
          ...user,
          email: e.target.value
        })} />
          <Button onClick={handleSave}>
            {saved ? <>
                <CheckIcon className="w-4 h-4 mr-2" />
                Saved Successfully!
              </> : 'Save Changes'}
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Account Statistics
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-slate-600 mb-1">Emergency Fund Status</p>
            <p className="text-xl font-bold text-slate-900">
              {user.emergencyMonthsCurrent} / {user.emergencyMonthsTarget}{' '}
              months
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Invested</p>
            <p className="text-xl font-bold text-slate-900">
              {fmtINR(totalInvested)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Risk Profile</p>
            <p className="text-xl font-bold text-slate-900">
              {user.riskProfile}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Account Status</p>
            <p className="text-xl font-bold text-success-600">Active</p>
          </div>
        </div>
      </Card>
    </div>;
  const riskTab = <Card>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Risk Profile Assessment
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        Your risk profile determines how your investments are allocated across
        different asset classes.
      </p>

      <div className="space-y-4">
        <Select label="Select Your Risk Profile" value={user.riskProfile} onChange={e => setUser({
        ...user,
        riskProfile: e.target.value
      })} options={[{
        value: 'Low',
        label: 'Low (Conservative) - Prefer stability over growth'
      }, {
        value: 'Moderate',
        label: 'Moderate (Balanced) - Balance growth and stability'
      }, {
        value: 'High',
        label: 'High (Aggressive) - Maximize growth potential'
      }]} />

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-medium text-slate-900 mb-2">
            Current Allocation
          </h4>
          <div className="space-y-2 text-sm">
            {user.riskProfile === 'Low' && <>
                <p className="text-slate-700">• Equity: 40%</p>
                <p className="text-slate-700">• Debt: 45%</p>
                <p className="text-slate-700">• Gold: 12%</p>
                <p className="text-slate-700">• REIT: 3%</p>
              </>}
            {user.riskProfile === 'Moderate' && <>
                <p className="text-slate-700">• Equity: 60%</p>
                <p className="text-slate-700">• Debt: 30%</p>
                <p className="text-slate-700">• Gold: 8%</p>
                <p className="text-slate-700">• REIT: 2%</p>
              </>}
            {user.riskProfile === 'High' && <>
                <p className="text-slate-700">• Equity: 75%</p>
                <p className="text-slate-700">• Debt: 15%</p>
                <p className="text-slate-700">• Gold: 8%</p>
                <p className="text-slate-700">• REIT: 2%</p>
              </>}
          </div>
        </div>

        <Input label="Emergency Fund Target (months)" type="number" value={user.emergencyMonthsTarget} onChange={e => setUser({
        ...user,
        emergencyMonthsTarget: parseInt(e.target.value) || 6
      })} helperText="Recommended: 6 months of expenses" />

        <Button onClick={handleSave}>
          {saved ? <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Saved Successfully!
            </> : 'Update Risk Profile'}
        </Button>
      </div>
    </Card>;
  const preferencesTab = <Card>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Notification Preferences
      </h3>
      <div className="space-y-4">
        <Checkbox label="Newsletter subscription (weekly insights)" checked={preferences.newsletter} onChange={e => setPreferences({
        ...preferences,
        newsletter: e.target.checked
      })} />
        <Checkbox label="Plan alerts (rebalancing suggestions)" checked={preferences.alerts} onChange={e => setPreferences({
        ...preferences,
        alerts: e.target.checked
      })} />
        <Checkbox label="Weekly progress report" checked={preferences.weeklyReport} onChange={e => setPreferences({
        ...preferences,
        weeklyReport: e.target.checked
      })} />

        <Button onClick={handleSave} className="mt-6">
          {saved ? <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Saved Successfully!
            </> : 'Save Preferences'}
        </Button>
      </div>
    </Card>;
  const dataTab = <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          Export Your Data
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Download all your financial data including goals, investments, and
          transaction history.
        </p>
        <Button variant="secondary">Export Data (JSON)</Button>
      </Card>

      <Card className="border-danger-200 bg-danger-50">
        <h3 className="text-lg font-semibold text-danger-900 mb-4">
          Danger Zone
        </h3>
        <p className="text-sm text-danger-700 mb-4">
          Deleting your account is permanent and cannot be undone. All your data
          will be permanently removed.
        </p>
        <Button variant="danger">Delete Account</Button>
      </Card>
    </div>;
  return <PageContainer title="Profile & Settings" description="Manage your account and preferences">
      <Tabs tabs={[{
      id: 'profile',
      label: 'Profile',
      content: profileTab
    }, {
      id: 'risk',
      label: 'Risk Profile',
      content: riskTab
    }, {
      id: 'preferences',
      label: 'Preferences',
      content: preferencesTab
    }, {
      id: 'data',
      label: 'Data & Privacy',
      content: dataTab
    }]} />
    </PageContainer>;
}