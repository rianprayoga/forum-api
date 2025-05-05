const CreatedComment = require("../CreatedComment");

describe('CreatedComment', ()=> {

    it('should throw error when missing attribute', ()=>{

        expect(() => new CreatedComment({}))
            .toThrowError('CREATED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when mismatch type', ()=>{

        expect(() => new CreatedComment({id: true, content: [], owner:123}))
            .toThrowError('CREATED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should sucessfully init', ()=>{
        const actual = new CreatedComment({id: 'true', content: 'what', owner:'123'})

        const {id, content, owner} = new CreatedComment({id: 'true', content: 'what', owner:'123'});

        expect(id).toEqual(actual.id);
        expect(content).toEqual(actual.content);
        expect(owner).toEqual(actual.owner);
    });

});