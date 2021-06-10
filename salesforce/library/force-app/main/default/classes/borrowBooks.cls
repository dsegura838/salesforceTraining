public with sharing class borrowBooks {
    @AuraEnabled
    public static string borrowBooks(List<Book__c> bookList, Id userID) {
        try {
            System.debug(userID);
            //Create List to store books
            List<Book__c> updateBooks = new List<Book__c>();
            //create list to store book_borrow_info
            List<Book_Borrow_Information__c> newBBI = new List<Book_Borrow_Information__c>();

            //Loop through booklist parameter
            for(Book__c book : bookList){
                //Create book and Book_B_info object
                Book__c updateBook = new Book__c();
                Book_Borrow_Information__c borrowBookInfo = new Book_Borrow_Information__c();
                //use Id to match book and update status__c 
                updateBook.Id = book.Id;
                updateBook.Status__c = 'BORROWED';
                //add book to list of books to be updated
                updateBooks.add(updateBook);

                //add info to book_B_info object
                borrowBookInfo.Book__c = book.Id;
                borrowBookInfo.User__c = userID;
                
                borrowBookInfo.Issued_Date__c = Date.today();
                borrowBookInfo.Returned_Date__c = Date.today()+14;
                borrowBookInfo.IsBorrowActive__c = true;
                //add to list of Book_Borrow_Info that needs to be inserted
                newBBI.add(borrowBookInfo);
            }
            //DML statements
            update updateBooks;
            insert newBBI;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return 'Success';
    }
   
}
