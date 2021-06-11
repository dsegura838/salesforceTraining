import { LightningElement } from 'lwc';
import Book from '@salesforce/schema/Book__c';
import Title from '@salesforce/schema/Book__c.Name';
import Author from '@salesforce/schema/Book__c.Author__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AddBooks extends LightningElement {
    
    //Assign Book__c object
    objectApiName = Book;
    //Assign fields
    fields=[Title, Author];

    //method to handle successful addition of book
    handleSuccess(event){
        const toast = new ShowToastEvent({
            title:'success',
            message: 'Record Id: '+ event.detail.id,
            variant:'success'
        });
        //dispatch event
        this.dispatchEvent(toast); 
    }
}