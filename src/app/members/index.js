import memberEditBtn from './directives/memberEditBtn';
import restoreAdministratorPanel from './directives/restoreAdministratorPanel';
import memberApi from './factories/memberApi';
import memberModel from './factories/memberModel';
import memberModal from './modals/memberModal';
import editMemberProcess from './services/editMemberProcess';
import memberActions from './services/memberActions';
import memberSubLogin from './services/memberSubLogin';
import membersValidator from './services/membersValidator';

export default angular
    .module('proton.members', [])
    .directive('memberEditBtn', memberEditBtn)
    .directive('restoreAdministratorPanel', restoreAdministratorPanel)
    .factory('memberApi', memberApi)
    .factory('memberModel', memberModel)
    .factory('memberModal', memberModal)
    .factory('editMemberProcess', editMemberProcess)
    .factory('memberActions', memberActions)
    .factory('memberSubLogin', memberSubLogin)
    .factory('membersValidator', membersValidator).name;
