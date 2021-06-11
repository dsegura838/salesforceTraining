import { LightningElement, track, wire } from 'lwc';
// import server side apex class method 
import getBookList from '@salesforce/apex/LibrarySearch.getBookList';


//might need to change this
const columns = [
    { label: 'Book Id', fieldName: 'Book_Id', type:'text',},
    { label: 'Book Name', fieldName: 'Title', type: 'text',}, 
    { label: 'Author', fieldName: 'Author', type:'text',},
    { label: 'Status', fieldName: 'Status', type: 'text',}, 
    { label: 'Issued Date', fieldName: 'Issued_Date__c', type: 'date',},
    { label: 'Returned Date', fieldName: 'Returned_Date__c', type:'date',},
    { label: 'Borrow Active', fieldName: 'IsBorrowActive__c', type:'text',},
    { label: 'UserId', fieldName: 'UserId', type: 'text'},
    
];

export default class LibrarySearch extends LightningElement {

    
    searchData;
    columns = columns;
    errorMsg = '';
    strSearchUserId = '';

    //update searchValue when input field changes
    handleUserId(event){
        this.errorMsg = '';
        this.strSearchUserId = event.target.value;
        console.log(this.strSearchUserId);
       
    }
    //call apex method on button click
    handleSearch(){
        //I modified this
        if(!this.strSearchUserId){
            this.errorMsg = 'Please enter a User ID';
            this.searchData = undefined;
            return;
        }
            
        
        getBookList({
                searchKey : this.strSearchUserId})
            
                .then(result =>{
                    
                this.searchData = result;
                console.log(this.searchData);
                //create an array to store flattened data
                let preparedBooks = [];
                //loop through returned data to transform it
                this.searchData.forEach(book=>{
                    //create a new object to put transformed data into
                    let preparedBook = {};
                    preparedBook.Book_Id = book.Book__c;
                    //console.log('Error 1');
                    preparedBook.Title = book.Book__r.Name;
                    //console.log('Error 2');
                    preparedBook.Author = book.Book__r.Author__c;
                    //console.log('Error 3');
                    preparedBook.Status = book.Book__r.Status__c;
                    //console.log('Error 4');
                    preparedBook.Issued_Date__c = book.Issued_Date__c;
                    //console.log('Error 5');
                    preparedBook.Returned_Date__c = book.Returned_Date__c;
                    //console.log('Error 6');
                    preparedBook.IsBorrowActive__c = book.IsBorrowActive__c;
                    //console.log('Error 7');
                    preparedBook.UserId = book.User__c;
                    //console.log('Error 8');
                    //push the flattened data into the array
                    preparedBooks.push(preparedBook);
                    //assign flattened data to searchData variable
                    this.searchData = preparedBooks;

                })
            })
            .catch(error =>{
                this.searchData = undefined;
                this.errorMsg = error;
          
        });
    }
}