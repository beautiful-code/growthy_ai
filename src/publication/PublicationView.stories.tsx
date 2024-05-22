import { ExercisePublication, PublicationSection } from "types";
import { PublicationView, PublicationViewProps } from "./PublicationView";
import { FixtureWrapper } from "FixtureWrapper";
import { Meta, StoryObj } from "@storybook/react";

const publicationSections: PublicationSection[] = [
  {
    title: "Introduction to My Sanskrit Journey",
    content:
      "### Understanding Rails Environment Mechanics\n" +
      "Rails environments are crucial for the proper functioning and management of a Rails application. They ensure that the application behaves appropriately under different conditions, such as development, testing, and production. One of the core functionalities that Rails provides is the ability to query the current environment and adjust the applications behavior accordingly. This is achieved through a combination of environment variables and Ruby classes designed to make working with environments intuitive and straightforward.\n" +
      "#### How Rails Determines the Current Environment\n" +
      "```ruby\n" +
      "# railties/lib/rails.rb\n" +
      "module Rails\n" +
      "  class << self\n" +
      "    def env\n" +
      "      @_env ||= ActiveSupport::EnvironmentInquirer.new(\n" +
      '        ENV["RAILS_ENV"].presence || \n' +
      '        ENV["RACK_ENV"].presence || \n' +
      '        "development"\n' +
      "      )\n" +
      "    end\n" +
      "  end\n" +
      "end\n" +
      "```\n",
  },
  {
    title: "Discovering The Sanskrit Channel",
    content:
      "Dummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4\nDummy content 4",
  },
  {
    title: "My Daily Sanskrit Learning Routine",
    content: "Dummy content 3",
  },
  {
    title: "Reflections and Impressions",
    content: "Dummy content 1\nDummy content 2",
  },
];

const exercisePublication: ExercisePublication = {
  title: "Embarking on the Journey of Sanskrit: A Personal Odyssey",
  sections: publicationSections,
};

const PublicationViewStory: React.FC<PublicationViewProps> = ({ ...props }) => {
  return (
    <FixtureWrapper>
      <PublicationView {...props} />
    </FixtureWrapper>
  );
};

const meta = {
  title: "Publication/PublicationView",
  component: PublicationViewStory,
  tags: ["autodocs"],
  args: {},
} satisfies Meta<typeof PublicationView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BaseCase: Story = {
  args: {
    useGetExercisePublication: () => {
      return { data: exercisePublication, isLoading: false };
    },
    useParams: () => ({ id: "123" }),
  },
};
