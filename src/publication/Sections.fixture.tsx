/* eslint-disable react-hooks/rules-of-hooks */
import { PublicationSection } from "types";
import { Sections } from "publication/components/Sections";
import { useRef, useState } from "react";
import { FixtureWrapper } from "FixtureWrapper";

const publicationSections: PublicationSection[] = [
  {
    title: "Introduction to My Sanskrit Journey",
    content:  
    '### Understanding Rails Environment Mechanics\n' +
    'Rails environments are crucial for the proper functioning and management of a Rails application. They ensure that the application behaves appropriately under different conditions, such as development, testing, and production. One of the core functionalities that Rails provides is the ability to query the current environment and adjust the applications behavior accordingly. This is achieved through a combination of environment variables and Ruby classes designed to make working with environments intuitive and straightforward.\n' + 
    '#### How Rails Determines the Current Environment\n' + 
    '```ruby\n' +
    '# railties/lib/rails.rb\n' +
    'module Rails\n' +
    '  class << self\n' +
    '    def env\n' +
    '      @_env ||= ActiveSupport::EnvironmentInquirer.new(\n' +
    '        ENV["RAILS_ENV"].presence || \n' +
    '        ENV["RACK_ENV"].presence || \n' +
    '        "development"\n' +
    '      )\n' +
    '    end\n' +
    '  end\n' +
    'end\n' +
    '```\n',
  },
  {
    title: "Discovering The Sanskrit Channel",
    content: `Dummy content 1
            Dummy content 2
            Dummy content 3
            Dummy content 4
            Dummy content 5
            Dummy content 6
            Dummy content 7`,
  },
  {
    title: "My Daily Sanskrit Learning Routine",
    content: `Dummy content 1
            Dummy content 2
            Dummy content 3
            Dummy content 4
            Dummy content 5
            Dummy content 6
            Dummy content 7`,
  },
  {
    title: "Reflections and Impressions",
    content: `Dummy content 1
            Dummy content 2
            Dummy content 3
            Dummy content 4
            Dummy content 5
            Dummy content 6
            Dummy content 7`,
  },
];

export default {
  "Base Case": () => {
    const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
    const hasUserSelectedSectionRef = useRef(true);

    const onTopSectionChangeCallback = (sectionIndex: number) => {
      setSelectedSectionIndex(sectionIndex);
    };

    return (
      <FixtureWrapper>
        <Sections
          publicationSections={publicationSections}
          selectedSectionIndex={selectedSectionIndex}
          onTopSectionChangeCallback={onTopSectionChangeCallback}
          hasUserSelectedSectionRef={hasUserSelectedSectionRef}
        />
      </FixtureWrapper>
    );
  },

  "Last Section Selected": () => {
    const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(publicationSections.length - 1);
    const hasUserSelectedSectionRef = useRef(true);

    const onTopSectionChangeCallback = (sectionIndex: number) => {
      setSelectedSectionIndex(sectionIndex);
    };

    return (
      <FixtureWrapper>
        <Sections
          publicationSections={publicationSections}
          selectedSectionIndex={selectedSectionIndex}
          onTopSectionChangeCallback={onTopSectionChangeCallback} 
          hasUserSelectedSectionRef={hasUserSelectedSectionRef}        
        />
      </FixtureWrapper>
    );
  },
};
