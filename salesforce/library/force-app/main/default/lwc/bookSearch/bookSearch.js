import { LightningElement, track } from 'lwc';
//import Name from '@salesforce/book__c/Name';
// import server side apex class method
import getBooksByName from '@salesforce/apex/LibrarySearch.getBooksByName';


export default class BookSearch extends LightningElement {
    @track searchData;
    errorMsg;
    strSearchBookName;

    columns = [
        { label: 'Book Id', fieldName: 'Book_Id', type:'text'},
        { label: 'Book Name', fieldName: 'Title', type: 'text'}, 
        { label: 'Author', fieldName: 'Author', type:'text'},
        { label: 'Status', fieldName: 'Status', type: 'text'},
        
    ];

    //update searchValue when input field changes
    handleBookName(event){
        this.errorMsg = undefined;
        console.log('In handleBookName');
        this.strSearchBookName = event.detail.value;
        console.log(this.strSearchBookName);
       
    }

    handleSearch() {
        if(!this.strSearchBookName) {
            console.log('In handleSearch');
            this.errorMsg = 'Please enter Book name to search.';
            this.searchData = undefined;
            //return;
        }
    
        getBooksByName({
            searchKey : this.strSearchBookName})
            .then(result => {
                //assign method output to searchData variable
                this.searchData = result
                this.errorMsg = undefined;

                //create array to store flattened data
                let preparedBooks = [];
                this.searchData.forEach(data=>{ 
                    //create an empty object to store flattened data
                    let preparedBook = {};
                    preparedBook.Book_Id = data.Id;
                    console.log('Error 1');
                    preparedBook.Title = data.Name;
                    console.log('Error 2');
                    preparedBook.Author = data.Author__c;
                    console.log('Error 3');
                    preparedBook.Status = data.Status__c;
                    console.log('Error 4');
                
                    //push flattened data into preparedBooks array
                    preparedBooks.push(preparedBook);
                });
                //assign flattened data to searchData variable;
                this.searchData = preparedBooks;
                console.log('success');
            })
            .catch(error =>{
                this.searchData = undefined;
                this.errorMsg = error;
                console.log('something went wrong');
              
            });
     }
}