import { LightningElement, track } from 'lwc';
import searchBooks from '@salesforce/apex/LibrarySearch.searchBooks';
import borrowBooks from '@salesforce/apex/borrowBooks.borrowBooks';
import Id from '@salesforce/user/Id';
import { ShowToastEvent} from 'lightning/platformShowToastEvent';



export default class SearchBooks2 extends LightningElement {
    @track listOfBooks;
    searchType='Name';
    errorMsg = '';
    strSearch='';
    selectedBooks;

    
    //lightning-datatable columns
    columns=[
        {label: 'Id', fieldName: 'Id__c'},
        {label: 'Name', fieldName: 'Name',  type: "text"},
        {label: 'Author', fieldName: 'Author__c', type: "text"},
        {label: 'Status', fieldName: 'Status__c', type:"picklist"},
    ];
    
    //radio button options
    get options() {
        return [
            { label: 'Id', value: 'Id__c' },
            { label: 'Name', value: 'Name', type: "text"},
            { label: 'Author', value: 'Author__c', type:"text"},
            
        ];
    }
    
    //function to handle search query
    handleSearchQuery(event){
        this.errorMsg = '';
        this.strSearch = event.target.value;
        console.log(this.strSearch);
        
    }
    
    //function to handle search type selection
    handleRadioChange(event){
        this.searchType = event.detail.value;
        console.log(this.searchType);
    }
    
    //make sure that a value was entered
    handleSearch(){
        
        searchBooks({searchKey: this.strSearch, searchType: this.searchType})
            .then(result=>{
                this.errorMsg = undefined;
                this.listOfBooks = result;
            })
            .catch(error =>{
                this.listOfBooks=undefined;
                this.errorMsg = error;
            })
    }
    //handle selected rows
    getSelectedName(event){
        this.selectedBooks = event.detail.selectedRows;
        console.log(this.selectedBooks);
    }
    //when user clicks borrow button
    handleBorrowBook(){
        
        console.log('Current user extracted is '+ Id);
        borrowBooks({bookList: this.selectedBooks, userID: Id})
        //create a promise
            .then(result =>{
                this.errorMsg = undefined;
                const toast = new ShowToastEvent({
                    title: result,
                    message: 'Book Borrowed Successfully',
                    variant: 'success',
                });
                this.dispatchEvent(toast);
                //call handleSearch to refresh the grid
                this.handleSearch();
            })
            .catch((error)=>{
                this.errorMsg = error;
            });
    }
}