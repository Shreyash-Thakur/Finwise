import React, { useEffect, useState } from 'react';
import { CheckIcon } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getStoredTheme, setStoredTheme, applyTheme, type Theme } from '../lib/theme';
export function Settings() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme());
  const [preferLiveData, setPreferLiveData] = useState(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    // Listen for theme changes from toggle
    const handleThemeChange = (e: CustomEvent) => {
      setTheme(e.detail.theme);
    };
    window.addEventListener('themechange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themechange', handleThemeChange as EventListener);
    };
  }, []);
  const handleSave = () => {
    setStoredTheme(theme);
    applyTheme(theme);
    // Trigger theme change event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: {
        theme
      }
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
    // Trigger theme change event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: {
        theme: newTheme
      }
    }));
  };
  return <PageContainer title="Settings" description="Manage your preferences and data sources">
      <div className="max-w-3xl space-y-6">
        {/* Theme Settings */}
        <Card style={{
        backgroundColor: `rgb(var(--card))`,
        borderColor: `rgb(var(--border))`
      }}>
          <h3 className="text-lg font-semibold mb-4" style={{
          color: `rgb(var(--text))`
        }}>
            Appearance
          </h3>
          <div className="space-y-4">
            <Select label="Theme" value={theme} onChange={e => handleThemeChange(e.target.value as Theme)} options={[{
            value: 'light',
            label: 'Light'
          }, {
            value: 'dark',
            label: 'Dark'
          }]} />
            <p className="text-sm" style={{
            color: `rgb(var(--text-muted))`
          }}>
              Choose how FinWise looks. Changes apply immediately across all
              pages.
            </p>
          </div>
        </Card>

        {/* Data Settings */}
        <Card style={{
        backgroundColor: `rgb(var(--card))`,
        borderColor: `rgb(var(--border))`
      }}>
          <h3 className="text-lg font-semibold mb-4" style={{
          color: `rgb(var(--text))`
        }}>
            Data Sources
          </h3>
          <div className="space-y-4">
            <Checkbox label="Prefer live data when available" checked={preferLiveData} onChange={e => setPreferLiveData(e.target.checked)} />
            <p className="text-sm" style={{
            color: `rgb(var(--text-muted))`
          }}>
              When API keys are configured, FinWise will fetch live market data.
              Otherwise, educational seed data will be used.
            </p>

            <div className="rounded-lg p-4" style={{
            backgroundColor: `rgba(var(--muted), 0.5)`,
            border: `1px solid rgb(var(--border))`
          }}>
              <h4 className="font-medium mb-2" style={{
              color: `rgb(var(--text))`
            }}>
                Current Data Source
              </h4>
              <div className="flex items-center gap-2">
                <Badge variant="default">Seed Data</Badge>
                <span className="text-sm" style={{
                color: `rgb(var(--text-muted))`
              }}>
                  (No API keys configured)
                </span>
              </div>
              <p className="text-xs mt-2" style={{
              color: `rgb(var(--text-muted))`
            }}>
                To enable live data, add API keys to your .env file
              </p>
            </div>
          </div>
        </Card>

        {/* Currency Settings */}
        <Card style={{
        backgroundColor: `rgb(var(--card))`,
        borderColor: `rgb(var(--border))`
      }}>
          <h3 className="text-lg font-semibold mb-4" style={{
          color: `rgb(var(--text))`
        }}>
            Regional Settings
          </h3>
          <div className="space-y-4">
            <Select label="Currency" value="INR" onChange={() => {}} options={[{
            value: 'INR',
            label: '₹ Indian Rupee (INR)'
          }, {
            value: 'USD',
            label: '$ US Dollar (USD)'
          }]} />
            <p className="text-sm" style={{
            color: `rgb(var(--text-muted))`
          }}>
              Primary currency for displaying values and calculations
            </p>
          </div>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full">
          {saved ? <>
              <CheckIcon className="w-4 h-4 mr-2" />
              Settings Saved!
            </> : 'Save Settings'}
        </Button>
      </div>
    </PageContainer>;
}