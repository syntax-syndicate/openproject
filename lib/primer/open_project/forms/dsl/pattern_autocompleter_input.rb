# frozen_string_literal: true

module Primer
  module OpenProject
    module Forms
      module Dsl
        class PatternAutocompleterInput < Primer::Forms::Dsl::Input
          attr_reader :name, :label

          def initialize(name:, label:, **system_arguments)
            @name = name
            @label = label

            super(**system_arguments)
          end

          def to_component
            PatternAutocompleter.new(nil)
          end

          def type
            :pattern_autocompleter
          end

          def focusable?
            true
          end
        end
      end
    end
  end
end
