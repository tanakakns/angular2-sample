import {Component}             from 'angular2/core';
import {Person}                from './person';
import {PersonDetailComponent} from './person-detail.component';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [PersonDetailComponent]
})
export class AppComponent {

		person: Person;

		getPerson() {
				this.person = new Person();
		}
}