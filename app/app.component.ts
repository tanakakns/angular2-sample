import {Component}             from 'angular2/core';
import {Person}                from './person';
import {PersonDetailComponent} from './person-detail.component';
import {PersonService}         from './person.service';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    directives: [PersonDetailComponent],
    providers: [PersonService]
})
export class AppComponent {
	  constructor(private _service: PersonService){}

		person: Person;

		getPerson() {
				this.person = this._service.getPerson();
		}
}