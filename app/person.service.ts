import {Injectable} from 'angular2/core';
import {Person}     from './person';

@Injectable()
export class PersonService {
	getPerson() {
			return new Person();
	}
}