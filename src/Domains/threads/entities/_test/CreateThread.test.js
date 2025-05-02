const CreateThread = require('../CreateThread');


describe('a CreateThread entities', () => {
    
    it('should throw error when payload did not contain needed property', () => {
  
      expect(() => new CreateThread({
        title: 'abc',
      })).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    
      expect(() => new CreateThread({
        body: 'abc',
      })).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');

      expect(() => new CreateThread({})).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    
    });
  
    it('should throw error when title is empty string', () => {
        
        const payload = {
            title: ''
        }

        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      
    });

    it('should throw error when body is empty string', () => {
        
        const payload = {
            title: ''
        }

        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
      
    });

    it('should throw error when payload did not meet data type specification', () => {
      const payload = {
        title: true,
        body: 1
      };
  
      expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
  
    it('should throw error when title contains more than 50 character', () => {
      const payload = {
        title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
        body: 'Dicoding Indonesia',
      };
  
      expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.TITLE_LIMIT_CHAR');
    });

    it('should throw error when body contains more than 50 character', () => {
        const payload = {
          body: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
          title: 'Dicoding Indonesia',
        };
    
        expect(() => new CreateThread(payload)).toThrowError('CREATE_THREAD.BODY_LIMIT_CHAR');
      });
  
  
    it('should create createThread object correctly', () => {
      const payload = {
        title: 'dicoding',
        body: 'Dicoding Indonesia',
      };
  
      const { title, body } = new CreateThread(payload);
  
      expect(title).toEqual(payload.title);
      expect(body).toEqual(payload.body);
    });
});
  