import { LightningElement, track, wire } from 'lwc';
// import server side apex class method 
import getBookList from '@salesforce/apex/LibrarySearch.getBookList';



const columns = [
    {
        label: 'Book Name',
        fieldName: 'Title',
        type: 'text',
    }, {
        label: 'Author',
        fieldName: 'Author',
        type:'text',
    },{
        label: 'Issued Date',
        fieldName: 'Issued_Date__c',
        type: 'date',
    },
    {
        label: 'Status',
        fieldName: 'Status',
        type: 'text',
    }, 
];

export default class LibrarySearch extends LightningElement {
// @wire(getBookList)
                    // book({error, data})
//     if(data){
//         let currentData = [];
//         data.forEach((row) => {
//             let rowData={};
//             rowData.Issued_Date__c = row.Issued_Date__c

//             //book related data
//             if(row.Book__r){
//                 rowData.Title = row.Book__r.Name;
//                 rowData.Author = row.Book__r.Author__c;
//                 rowData.Status = row.Book__r.Status__c;
//             }
//             currentData.push(rowData);
//         });
//         this.searchData = currentData;
//     }
//     else if(error){
//         window.console.log(error);
//     }
// // }
    
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
            })
            .catch(error =>{
                this.searchData = undefined;
                if(error){
                if(Array.isArray(error.body)){
                    this.errorMsg = error.body.map(e=>e.message).join(', ');
                }else if(typeof error.body.message === 'string'){
                    this.errorMsg = error.body.message;
                }
            }
        })
    }
}