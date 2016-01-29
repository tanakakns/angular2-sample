import {Component, Input} from 'angular2/core';
import {Person}           from './person';

@Component({
  selector: 'person-detail',
  templateUrl: 'app/person-detail.component.html',
  directives: [PersonDetailComponent]
})
export class PersonDetailComponent {
  @Input() person: Person;
}