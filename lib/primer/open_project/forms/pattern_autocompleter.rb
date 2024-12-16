# frozen_string_literal: true

module Primer
  module OpenProject
    module Forms
      class PatternAutocompleter < Primer::Forms::BaseComponent
        DEFAULT_PATTERN = Types::Pattern.new(blueprint: "{{author}} Vacation - {{start_date}} - {{end_date}} A", enabled: true)

        def initialize(pattern)
          super()
          @pattern = pattern || DEFAULT_PATTERN
        end

        def select_item_action
          { action: "click->pattern-autocompleter#item_select" }
        end
      end
    end
  end
end
