public with sharing class LibrarySearch {
    
    @AuraEnabled(cacheable=true)
    public static list<Book_Borrow_Information__c> getBookList(String searchKey) {
        
        
        //List to store book records
        list<Book_Borrow_Information__c> bookInfoRecords = new list<Book_Borrow_Information__c>();

        
        for(Book_Borrow_Information__c bookInfo : 
            [Select book__c, Book__r.Name, book__r.Author__c, book__r.Status__c, Issued_Date__c, Returned_Date__c, IsBorrowActive__c, user__c
            from Book_Borrow_Information__c 
            where user__c = :searchKey]){
                system.debug(bookInfo.user__c);
                bookInfoRecords.add(bookInfo);
        }
        
        //handle no search results
        if(bookInfoRecords.size() == 0){
            throw new AuraHandledException('No record found..');
        }
        
        //return bookInfoRecordsList
        return bookInfoRecords;
      
    }
    @AuraEnabled(cacheable=true)
    public static list<Book__c> getBooksByName(string searchKey){
        
        string searchKeyword = '%' + searchKey + '%';

        //List to store book info
        list<Book__c> bookInfoRecords = new list<Book__c>();

        for(Book__c bookInfo : [Select Id, Name, Author__c, status__c 
        from Book__c
        where Name LIKE :searchKeyword]){
            bookInfoRecords.add(bookInfo);
        }
        //handle no search results
        if(bookInfoRecords.size() == 0){
            throw new AuraHandledException('No records found..');
        }
        //return bookInfoRecords List
        return bookInfoRecords;
    }





    @AuraEnabled
    public static list<Book__c> searchBooks(string searchKey, string searchType){
        try {
            //create a search query with passed in parameters
            String query = 'Select Id__c, Name, Author__c, Status__c from Book__c where '+searchType+' LIKE '+'\''+'%'+searchKey+'%'+'\'';

            //pass results into a list
            List<Book__c> listOfBooks = Database.query(query);
            
            //return list
            return listOfBooks;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static list<Book_Borrow_Information__c> getUserBorrowedBooks(String currentUser){
        try {
            system.debug(currentUser);
            
            //pass in returned information to userBooks list
            
            List<Book_Borrow_Information__c> userBooks = [Select Id, Book__r.Id, Book__r.Name, Book__r.Status__c, User__r.Id, Issued_Date__c,Returned_Date__c, IsBorrowActive__c 
            from Book_Borrow_Information__c 
            where IsBorrowActive__c = true AND User__r.Id = :currentUser];
            
            //testing out bottom method
            // system.debug('Calling other method');
            // returnBooks(userBooks);

            //return list
            return userBooks;


        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Book_Borrow_Information__c> getBorrowHistory(Id userId){
        try {
            //create list to store BBI
            List<Book_Borrow_Information__c> borrowHist = [Select Id, Book__r.Id, Book__r.Name, Book__r.Author__c, Book__r.Status__c, IsBorrowActive__c 
            from Book_Borrow_Information__c 
            where IsBorrowActive__c = false AND User__r.Id = :userId];

            //return borrowHist list
            return borrowHist;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        
    }

    @AuraEnabled
    public static string returnBooks(List<Book_Borrow_Information__c> returnedBooks){
        try {
            //create new lists for book__c and Book_B_info__c
            List<Book__c> updatedBooks = new List<Book__c>();
            List<Book_Borrow_Information__c> updatedBookInfo = new List<Book_Borrow_Information__c>();

            for(Book_Borrow_Information__c b : returnedBooks){
                //create new Book and BBI objects
                Book__c book = new Book__c();
                Book_Borrow_Information__c bbi = new Book_Borrow_Information__c();
                //use Id to match bbi
                bbi.Id = b.Id;
                bbi.IsBorrowActive__c = false;
                bbi.Returned_Date__c = Date.today();
                
                system.debug('Book Info'+bbi);
                //add bbi to updatedBookInfo list
                updatedBookInfo.add(bbi);
                
                //use book__c to match id
                book.Id = b.book__c;
                book.Status__c = 'AVAILABLE';
                system.debug('Book to return'+book);
                system.debug('Book Status'+book.Status__c);
                //add book to updateBooks list
                updatedBooks.add(book);

            }
            
            //update book and bbi objects
            update updatedBooks;
            update updatedBookInfo;
            //system.debug(updatedBooks[2]);
            //system.debug(updatedBookInfo[3]);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
        return 'Success';
    }
}

