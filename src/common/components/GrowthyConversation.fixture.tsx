import { FixtureWrapper } from "FixtureWrapper";
import { GrowthyConversation } from "common/components/GrowthyConversation";

const mockResponse =
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
  "```\n";

const mockGetGuidance = async () => {
  return (async function* () {
    yield mockResponse;
  })();
};

const mockGetPersistedConversations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: "1",
            resourceId: "1",
            type: "chatbot",
            markdownText:
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
            resourceIdType: "execute",
          },
        ],
      });
    }, 1000);
  });
};

const mockEmptyGetPersistedConversations = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [],
      });
    }, 1000);
  });
};

const mockEmptyResponse = false;

export default {
  "Growthy Coversation with GoRoutines blog article": (
    <FixtureWrapper>
      <GrowthyConversation
        inputs={{
          blog_article_goal: "",
          blog_article_xml: "",
          blog_article_task: "",
        }}
        resourceId="1"
        onCloseCallback={() => {}}
        getConversation={mockGetGuidance}
        getPersistedConversations={
          mockEmptyResponse
            ? mockEmptyGetPersistedConversations
            : mockGetPersistedConversations
        }
        persistConversation={(convo: any) => {
          console.log("persistConversation", convo);
        }}
      />
    </FixtureWrapper>
  ),
};
