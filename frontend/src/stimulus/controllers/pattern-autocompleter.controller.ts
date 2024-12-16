/*
 * -- copyright
 * OpenProject is an open source project management software.
 * Copyright (C) the OpenProject GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License version 3.
 *
 * OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
 * Copyright (C) 2006-2013 Jean-Philippe Lang
 * Copyright (C) 2010-2013 the ChiliProject Team
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * See COPYRIGHT and LICENSE files for more details.
 * ++
 */

import { Controller } from '@hotwired/stimulus';

type Segment = { type:'plain'|'token', value:string };

export default class PatternAutocompleterController extends Controller {
  /*
   *    focus/highlight
   * [x]  on enter
   * [x]  on leave
   *    click
   * [x]  when the click hits a editable field
   * [x]  when the click hits a token
   * [x]  when the clicks hits only the parent div
   * [x]  when the click hits the 'x' on a token
   *    navigation
   * [x]  arrow keys
   * [x]  tab
   *    editting
   * [x]  backspace/delete when the next/previous character is a token
   * [x]  make sure it's possible to add text in the beginning and the end of the input
   * [x]  prevent enter key from entering new lines
   * [ ]  copy
   * [ ]  paste (with and without tokens)
   * [ ]  manually typing {{ tags
   *    accessibility concerns
   * [ ]  aria tokens
   *    form actions
   * [ ]  submit on enter?
   *    autocomplete popup
   * [ ]  autocomplete on key type
   * [ ]  adjust context of autocomplete based on the current word (e.g. typing in the middle of a word)
   * [ ]  keyboard support (UP/DOWN/SELECT)
   *    styling
   * [x]  primer CSS classes
  */

  static targets = [
    'tokenTemplate',
    'content',
  ];

  declare readonly tokenTemplateTarget:HTMLTemplateElement;
  declare readonly contentTarget:HTMLElement;

  static values = {
    initial: String,
  };

  declare initialValue:string;

  contentValue:Array<Segment> = [];

  connect() {
    this.contentValue = this.initialValue
      .split(/({{[0-9A-Za-z_]+}})/g)
      .filter(Boolean)
      .map((piece) => {
        if (piece.startsWith('{{')) {
          return { type: 'token', value: piece.replace('{{', '').replace('}}', '') };
        }
          return { type: 'plain', value: piece };
      });

    this.ensureSpaces();
    this.render();
  }

  remove_token(event:PointerEvent) {
    const target = event.target as HTMLElement;

    if (target) {
      target.parentElement?.remove();
    }
  }

  // Input field
  input_keydown(event:KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  input_change(event:Event) {
    const target = event.target as HTMLElement;

    if (target) {
      // TODO
    }
  }

  //Autocomplete
  item_select(event:PointerEvent) {
    const target = event.currentTarget as HTMLElement;

    if (target) {
      const token = target.dataset.value!;
      this.contentValue.push({ type: 'token', value: token });
      this.render();
    }
  }

  // internal methods

  private render():void {
    const content = this.contentValue.map((segment:Segment) => {
      return segment.type === 'token'
        ? this.tokenNodeWithValue(segment.value)
        : this.plainNodeWithValue(segment.value);
    });

    this.contentTarget.innerHTML = content.map((segment) => segment.outerHTML).join('');
  }

  private ensureSpaces():void {
    if (this.contentValue[0].type === 'token') {
      this.contentValue.splice(0, 0, { type: 'plain', value: ' ' });
    }

    if (this.contentValue[this.contentValue.length - 1].type === 'token') {
      this.contentValue.push({ type: 'plain', value: ' ' });
    }
  }

  private tokenNodeWithValue(valueText:string):HTMLElement {
    const target = this.tokenTemplateTarget.content?.cloneNode(true) as HTMLElement;
    const contentElement = target.firstElementChild as HTMLElement;
    (contentElement.querySelector('[data-role="token-text"]') as HTMLElement).innerText = valueText;
    return contentElement;
  }

  private plainNodeWithValue(valueText:string):HTMLElement {
    const target = document.createElement('span');
    target.innerText = valueText;
    return target;
  }
}
