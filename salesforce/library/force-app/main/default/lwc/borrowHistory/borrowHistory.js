import { LightningElement, track } from 'lwc';
import Id from '@salesforce/user/Id';
import getBorrowHistory from '@salesforce/apex/LibrarySearch.getBorrowHistory';

export default class BorrowHistory extends LightningElement {
    @track listOfBorrowedBooks;
    error;

    //columns to display
    columns=[
        {label:'Borrow Information Id', fieldName: 'Id', type:'text'},
        {label:'Book Id', fieldName: 'Book__c', type:'text'},
        {label:'Book Title', fieldName: 'Name', type:'text'},
        {label:'Book Status', fieldName:'Status__c', type:'picklist'},
        {label:'Borrow Active', fieldName:'IsBorrowActive__c', type:'text'},
    ];

    connectedCallback(){
        console.log('The user Id is: '+Id);
        //call function to flatten column data
        this.borrowHistoryList();
    }
    borrowHistoryList(){
        getBorrowHistory({userId: Id})
        .then((result)=>{
            //make sure Id was passed
            console.log('The user Id is: '+Id);
            console.log(result);
            //assign result from apex method to listOfBorrowedBooks variable
            this.listOfBorrowedBooks = result;
            
            //create an empty array
            let preparedBooks = [];
            //loop through listOfBorrowedBooks
            this.listOfBorrowedBooks.forEach(book=>{
                //create an empty object that will be inserted into the preparedBooks array
                let preparedBook = {};
                //make sure correct values are returned
                console.log('Borrow Id: '+ book.Id);
                //flatten the data
                preparedBook.Id = book.Id;
                //console.log('Error here 1');

                //console.log('Book Id: '+ book.Book__r.Id);
                preparedBook.Book__c = book.Book__r.Id;
                //console.log('Error here 2');
                //console.log('Title: '+ Book__r.Name);
                preparedBook.Name = book.Book__r.Name;
                //console.log('Error here 3');
                //console.log('Status: '+ Book__r.Status__c);
                preparedBook.Status__c = book.Book__r.Status__c;
                //console.log('Error here 4');
                console.log('Borrow Active: '+ book.IsBorrowActive__c);
                preparedBook.IsBorrowActive__c = book.IsBorrowActive__c;
                //push flattened data into preparedBooks array
                preparedBooks.push(preparedBook);
                window.console.log(preparedBooks);
            });
            //assign flattened data to listOfBorrowedBooks variable
            this.listOfBorrowedBooks = preparedBooks;
            this.error = undefined;
            console.log('success');
        })
        .catch((error)=>{
            this.error = error;
            this.listOfBorrowedBooks = undefined;
            console.log('something went wrong');
        });
    }
}