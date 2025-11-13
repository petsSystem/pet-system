import { ButtonPS } from "@components/ButtonPS";
import { Switch } from "@components/Switch";
import React, { useState } from "react";

interface TabProps {
  tabs: { label: string; content: React.ReactNode; icon?: JSX.Element }[];
  action?: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    onClick?: () => void;
    label: string;
    color: "red" | "green" | "yellow" | "orange";
    type?: "button" | "switch";
  };
}

const Tab: React.FC<TabProps> = ({ tabs, action }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div>
      <div className="border-b border-gray-200 flex  justify-between items-center">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 ">
          {tabs.map((tab, index) => (
            <li key={index} className="mr-2">
              <a
                className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg ${
                  index === activeTab
                    ? "text-primary-600 border-b-2 border-primary-500"
                    : "hover:text-primary-300 hover:border-primary-300"
                } ${index === activeTab ? "active " : "group"}`}
                onClick={() => handleTabClick(index)}
              >
                {!!tab.icon && <span className="pr-2">{tab.icon}</span>}
                {tab.label}
              </a>
            </li>
          ))}
        </ul>
        {action &&
          (action.type === "button" ? (
            <div className="mr-20">
              <button
                className="flex justify-center items-center btn  border-slate-400  hover:border-primary-300 dark:hover:border-slate-600 text-rose-500"
                onClick={action.onClick}
              >
                <svg
                  className="w-4 h-4 fill-current text-slate-500  shrink-1 text-rose-700"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.7.3c-.4-.4-1-.4-1.4 0l-10 10c-.2.2-.3.4-.3.7v4c0 .6.4 1 1 1h4c.3 0 .5-.1.7-.3l10-10c.4-.4.4-1 0-1.4l-4-4zM4.6 14H2v-2.6l6-6L10.6 8l-6 6zM12 6.6L9.4 4 11 2.4 13.6 5 12 6.6z" />
                </svg>
                <span className="ml-2">Alterar senha</span>
              </button>
              <button className="btn flex  border-slate-200  hover:border-primary-600  text-slate-600 "></button>
            </div>
          ) : (
            <Switch
              checked={action.checked}
              onChange={action.onChange}
              label={action.label}
              color={action.color}
            />
          ))}
      </div>
      <div className="p-4">
        {tabs.map((tab, index) => (
          <div
            className={`${activeTab === index ? "flex" : "hidden"}`}
            key={index}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tab;
