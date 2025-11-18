package br.com.petshop.commons.service;

import br.com.petshop.customer.model.entity.CustomerEntity;
import br.com.petshop.authentication.model.enums.Role;
import br.com.petshop.user.model.entity.UserEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.security.Principal;

/**
 * Classe utilizada por todo sistema para retornar dados do usuário principal.
 */
public abstract class AuthenticationCommonService {

    public CustomerEntity getAppAuthUser(Principal authentication) {
        return ((CustomerEntity) ((UsernamePasswordAuthenticationToken)
                authentication).getPrincipal());
    }

    public Role getAppRole(Principal authentication) {
        CustomerEntity authUser = ((CustomerEntity) ((UsernamePasswordAuthenticationToken)
                authentication).getPrincipal());

        return authUser.getRole();
    }

    public UserEntity getSysAuthUser(Principal authentication) {
        Object principal = ((UsernamePasswordAuthenticationToken) authentication).getPrincipal();
        if (principal instanceof UserEntity) {
            return (UserEntity) principal;
        }
        throw new ClassCastException("Principal is not an instance of UserEntity: " + principal.getClass().getName());
    }

    public Role getSysRole(Principal authentication) {
        UserEntity systemUser = getSysAuthUser(authentication);
        return systemUser.getRole();
    }
}
