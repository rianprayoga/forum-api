const CreatedThread = require('../CreatedThread');

describe('a CreateThread entities', () => {

    it('should throw error when payload did not contain needed property', () => {
  
        expect(() => new CreatedThread({
          title: 'abc',
        })).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      
        expect(() => new CreatedThread({
          id: 'abc',
        })).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

        expect(() => new CreatedThread({
            owner: 'abc',
        })).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  
        expect(() => new CreatedThread({})).toThrowError('CREATED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      
      });

    it('should throw error when payload did not meet data type specification', () => {

        const payload = {
            title:123,
            id:true, 
            owner: []
        };

        expect(() => new CreatedThread(payload)).toThrowError('CREATED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
      
    });

    it('should create createdThread object correctly', () => {

        const payload = {
            title:'dicoding',
            id:'dicoding d dicoding d', 
            owner: 'user-123'
        };
    
        const { id, title,  owner } = new CreatedThread(payload);
    
        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(owner).toEqual(payload.owner);
      });
});