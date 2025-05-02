const CreatedThread = require('../CreatedThread');

describe('a CreateThread entities', () => {

    it('should throw error when payload did not contain needed property', () => {
  
        expect(() => new CreatedThread({
          title: 'abc',
        })).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      
        expect(() => new CreatedThread({
          body: 'abc',
        })).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

        expect(() => new CreatedThread({
            owner: 'abc',
        })).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  
        expect(() => new CreatedThread({})).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      
      });

    it('should throw error when payload did not meet data type specification', () => {

        const payload = {
            title:123,
            body:true, 
            owner: []
        };

        expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      
    });

    it('should create createdThread object correctly', () => {

        const payload = {
            title:'dicoding',
            body:'dicoding d dicoding d', 
            owner: 'user-123'
        };
    
        const { title, body, owner } = new CreatedThread(payload);
    
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
      });
});