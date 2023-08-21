import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PageLoadSpinner from 'people/utils/PageLoadSpinner';
import NoResults from 'people/utils/OrgNoResults';
import { useStores } from 'store';
import { Organization } from 'store/main';
import avatarIcon from '../../public/static/profile_avatar.svg';

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
  min-width: 77vw;
  flex: 1 1 100%;
`;

const OrganizationText = styled.p`
  font-size: 1rem;
  text-transform: capitalize;
  font-weight: bold;
  margin-top: 15px;
`;

const OrganizationImg = styled.img`
  width: 60px;
  height: 60px;
`;

const OrganizationWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Organizations = () => {
    const [loading, setIsLoading] = useState<boolean>(false);
    const { main } = useStores();

    async function getUserOrganizations() {
        setIsLoading(true);
        await main.getUserOrganizations();
        setIsLoading(false);
    }

    useEffect(() => {
        getUserOrganizations();
    }, []);


    const renderOrganizations = () => {
        if (main.organizations.length) {
            return main.organizations.map((org: Organization, i: number) => (

                <OrganizationWrap key={i}>
                    <OrganizationImg src={org.img || avatarIcon} />
                    <OrganizationText>{org.name}</OrganizationText>
                </OrganizationWrap>
            ))
        } else {
            return <NoResults loading={loading} />
        }
    }

    return (
        <div>
            <Container>
                <PageLoadSpinner show={loading} />
                {renderOrganizations()}
            </Container>
        </div>
    );
};

export default Organizations;
