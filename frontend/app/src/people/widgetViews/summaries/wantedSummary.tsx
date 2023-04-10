/* eslint-disable func-style */
import React, { useCallback, useLayoutEffect, useRef, useEffect, useState } from 'react';
import { ButtonRow, Pad, T, Y, P, D, B, Img, Wrap, Assignee } from './wantedSummaries/style';
import { useLocation } from 'react-router-dom';
import api from '../../../api';
import { colors } from '../../../config/colors';
import Form from '../../../components/form';
import { sendBadgeSchema } from '../../../components/form/schema';
import { extractGithubIssue, extractGithubIssueFromUrl, formatPrice } from '../../../helpers';
import { useIsMobile } from '../../../hooks';
import { Button, Divider, Paragraph, Title } from '../../../components/common';
import GalleryViewer from '../../utils/galleryViewer';
import FavoriteButton from '../../utils/favoriteButton';
import { renderMarkdown } from '../../utils/renderMarkdown';
import { useStores } from '../../../store';
import { LanguageObject, awards } from '../../utils/language_label_style';
import NameTag from '../../utils/nameTag';
import CodingMobile from './wantedSummaries/codingMobile';
import CodingBounty from './wantedSummaries/codingBounty';
import CodingDesktop from './wantedSummaries/codingDesktop';
import { sendToRedirect } from '../../../helpers';
import { observer } from 'mobx-react-lite';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

interface WantedSummaryProps {
  description: any;
  priceMin: number;
  priceMax: number;
  gallery: any;
  ticketUrl: string;
  person: any;
  created: number;
  repo: string;
  issue: string;
  price: number;
  type: string;
  tribe: any;
  paid: boolean;
  badgeRecipient: any;
  loomEmbedUrl: string;
  codingLanguage: any;
  estimate_session_length: any;
  assignee: any;
  fromBountyPage: boolean;
  wanted_type: string;
  one_sentence_summary: string;
  github_description: string;
  show: boolean;
  setIsModalSideButton: any;
  setIsExtraStyle: any;
  formSubmit: any;
  title: string;
}

export default observer(WantedSummary);
function WantedSummary(props: WantedSummaryProps) {
  const {
    description,
    priceMin,
    priceMax,
    gallery,
    ticketUrl,
    person,
    created,
    repo,
    issue,
    price,
    type,
    tribe,
    paid,
    badgeRecipient,
    loomEmbedUrl,
    codingLanguage,
    estimate_session_length,
    assignee,
    fromBountyPage,
    wanted_type,
    one_sentence_summary,
    github_description,
    show,
    setIsModalSideButton,
    setIsExtraStyle,
    formSubmit,
    title
  } = props;
  console.log('PROPS', props);
  const heart = <FavoriteButton />;
  const titleString = one_sentence_summary ?? title;

  const imgRef: any = useRef(null);
  const [envHeight, setEnvHeight] = useState('100%');
  const isMobile = useIsMobile();
  const { main, ui } = useStores();
  const { peopleWanteds } = main;
  const color = colors['light'];

  const [assigneeInfo, setAssigneeInfo]: any = useState(null);
  const [saving, setSaving]: any = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [owner_idURL, setOwnerIdURL] = useState('');
  const [createdURL, setCreatedURL] = useState('');
  const [dataValue, setDataValue] = useState([]);
  const [peopleList, setPeopleList] = useState<any>();
  const [isAssigned, setIsAssigned] = useState<boolean>(false);
  const [assignedPerson, setAssignedPerson] = useState<any>();
  const [replitLink, setReplitLink] = useState('');
  const [creatorStep, setCreatorStep] = useState<number>(0);
  const [bountyPrice, setBountyPrice] = useState<any>(price ?? priceMin ?? 0);
  const [selectedAward, setSelectedAward] = useState('');
  const [isPaidStatusPopOver, setIsPaidStatusPopOver] = useState<boolean>(false);
  const [isPaidStatusBadgeInfo, setIsPaidStatusBadgeInfo] = useState<boolean>(false);
  const [isMarkPaidSaved, setIsMarkPaidSaved] = useState<boolean>(false);
  const [awardDetails, setAwardDetails] = useState<any>({
    name: '',
    image: ''
  });

  useEffect(() => {
    if (description) {
      setReplitLink(
        description.match(
          /https?:\/\/(www\.)?[replit]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
        )
      );
    }
  }, [description]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPaidStatusPopOver(false);
    }, 7000);

    return () => {
      clearTimeout(timer);
    };
  }, [isPaidStatusPopOver]);

  const handleAwards = (optionId) => {
    setSelectedAward(optionId);
  };

  const [showBadgeAwardDialog, setShowBadgeAwardDialog] = useState(false);

  const isMine = ui.meInfo?.owner_pubkey === person?.owner_pubkey;

  const [labels, setLabels] = useState([]);
  const [assigneeValue, setAssigneeValue] = useState(false);

  const assigneeHandlerOpen = () => setAssigneeValue((assigneeValue) => !assigneeValue);

  useEffect(() => {
    if (assignee?.owner_alias) {
      setIsAssigned(true);
    }
  }, [assignee]);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get(`people?page=1&search=&sortBy=last_login&limit=100`);
        setPeopleList(response);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleAssigneeDetails = useCallback(
    (value) => {
      setIsAssigned(true);
      setAssignedPerson(value);
      assigneeHandlerOpen();
      const newValue = {
        title: titleString,
        wanted_type: wanted_type,
        one_sentence_summary: one_sentence_summary,
        ticketUrl: ticketUrl,
        github_description: github_description,
        description: description,
        price: price,
        assignee: {
          owner_alias: value?.owner_alias || '',
          owner_pubkey: value?.owner_pubkey || '',
          img: value?.img || '',
          value: value?.owner_pubkey || '',
          label: `${value.owner_alias} (${value.owner_alias.toLowerCase().replace(' ', '')})` || ''
        },
        codingLanguage: codingLanguage?.map((x) => {
          return { ...x };
        }),
        estimate_session_length: estimate_session_length,
        show: show,
        type: type,
        created: created
      };
      formSubmit && formSubmit(newValue);
    },
    [
      codingLanguage,
      created,
      description,
      estimate_session_length,
      formSubmit,
      github_description,
      one_sentence_summary,
      price,
      show,
      ticketUrl,
      titleString,
      type,
      wanted_type
    ]
  );

  const changeAssignedPerson = useCallback(() => {
    setIsAssigned(false);
  }, []);

  useEffect(() => {
    (async () => {
      if (props.assignee) {
        try {
          const p = await main.getPersonByPubkey(props.assignee.owner_pubkey);
          setAssigneeInfo(p);
        } catch (e) {
          console.log('e', e);
        }
      }
    })();
  }, [main, props.assignee, tribe]);

  useEffect(() => {
    let res;
    if (codingLanguage?.length > 0) {
      res = LanguageObject?.filter((value) => {
        return codingLanguage?.find((val) => {
          return val.label === value.label;
        });
      });
    }
    setDataValue(res);
    setLabels(res);
  }, [codingLanguage]);

  const searchParams = useQuery();

  useEffect(() => {
    const owner_id = searchParams.get('owner_id');
    const created = searchParams.get('created');
    setOwnerIdURL(owner_id ?? '');
    setCreatedURL(created ?? '');
  }, [owner_idURL, createdURL, searchParams]);

  useEffect(() => {
    if (codingLanguage) {
      const values = codingLanguage.map((value) => ({ ...value }));
      setLabels(values);
    }
  }, [codingLanguage]);

  async function setExtrasPropertyAndSave(propertyName: string, value: any) {
    if (peopleWanteds) {
      setSaving(propertyName);
      try {
        const [clonedEx, targetIndex] = await main.setExtrasPropertyAndSave(
          'wanted',
          propertyName,
          created,
          value
        );

        // saved? ok update in wanted list if found
        const peopleWantedsClone: any = [...peopleWanteds];
        const indexFromPeopleWanted = peopleWantedsClone.findIndex((f) => {
          const val = f.body || {};
          return f.person.owner_pubkey === ui.meInfo?.owner_pubkey && val.created === created;
        });

        // if we found it in the wanted list, update in people wanted list
        if (indexFromPeopleWanted > -1) {
          // if it should be hidden now, remove it from the list
          if ('show' in clonedEx[targetIndex] && clonedEx[targetIndex].show === false) {
            peopleWantedsClone.splice(indexFromPeopleWanted, 1);
          } else {
            // gotta update person extras! this is what is used for summary viewer
            const personClone: any = person;
            personClone.extras['wanted'][targetIndex] = clonedEx[targetIndex];

            peopleWantedsClone[indexFromPeopleWanted] = {
              person: personClone,
              body: clonedEx[targetIndex]
            };
          }
          console.log('peopleWantedsClone:', peopleWantedsClone);
          main.setPeopleWanteds(peopleWantedsClone);
        }
      } catch (e) {
        console.log('e', e);
      }

      setSaving('');
    }
  }

  async function setExtrasPropertyAndSaveMultiple(propertyName: any, dataObject: any) {
    if (peopleWanteds) {
      setIsMarkPaidSaved(true);
      try {
        const [clonedEx, targetIndex] = await main.setExtrasMultipleProperty(
          dataObject,
          'wanted',
          created
        );

        // saved? ok update in wanted list if found
        const peopleWantedsClone: any = [...peopleWanteds];
        const indexFromPeopleWanted = peopleWantedsClone.findIndex((f) => {
          const val = f.body || {};
          return f.person.owner_pubkey === ui.meInfo?.owner_pubkey && val.created === created;
        });

        // if we found it in the wanted list, update in people wanted list
        if (indexFromPeopleWanted > -1) {
          // if it should be hidden now, remove it from the list
          if ('show' in clonedEx[targetIndex] && clonedEx[targetIndex].show === false) {
            peopleWantedsClone.splice(indexFromPeopleWanted, 1);
          } else {
            // gotta update person extras! this is what is used for summary viewer
            const personClone: any = person;
            personClone.extras['wanted'][targetIndex] = clonedEx[targetIndex];

            peopleWantedsClone[indexFromPeopleWanted] = {
              person: personClone,
              body: clonedEx[targetIndex]
            };
          }

          console.log('peopleWantedsClone:', peopleWantedsClone);
          main.setPeopleWanteds(peopleWantedsClone);
        }
      } catch (e) {
        console.log('e', e);
      }

      setIsMarkPaidSaved(false);
    }
  }

  const handleCopyUrl = useCallback(() => {
    const el = document.createElement('input');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setIsCopied(true);
  }, []);

  const handleCopyUrlProfilePage = useCallback(() => {
    const { location } = window;
    const { host } = location;
    // eslint-disable-next-line prefer-destructuring
    const id = location.href.split('/')[4];

    const el = document.createElement('input');
    el.value = `${host}/tickets?owner_id=${id}&created=${created}`;
    document.body.appendChild(el);
    el.select();

    document.execCommand('copy');
    document.body.removeChild(el);
    setIsCopied(true);
  }, [created]);

  async function sendBadge(body: any) {
    const { recipient, badge } = body;

    setSaving('badgeRecipient');
    try {
      if (badge?.amount < 1) {
        alert("You don't have any of the selected badge");
        throw new Error("You don't have any of the selected badge");
      }

      // first get the user's liquid address
      const recipientDetails = await main.getPersonByPubkey(recipient.owner_pubkey);

      const liquidAddress =
        recipientDetails?.extras?.liquid && recipientDetails?.extras?.liquid[0]?.value;

      if (!liquidAddress) {
        alert('This user has not provided an L-BTC address');
        throw new Error('This user has not provided an L-BTC address');
      }

      const pack = {
        asset: badge.id,
        to: liquidAddress,
        amount: 1,
        memo: props.ticketUrl
      };

      const r = await main.sendBadgeOnLiquid(pack);

      if (r.ok) {
        await setExtrasPropertyAndSave('badgeRecipient', recipient.owner_pubkey);
        setShowBadgeAwardDialog(false);
      } else {
        alert(r.statusText || 'Operation failed! Contact support.');
        throw new Error(r.statusText);
      }
    } catch (e) {
      console.log(e);
    }

    setSaving('');
  }

  useLayoutEffect(() => {
    if (imgRef && imgRef.current) {
      if (imgRef.current?.offsetHeight > 100) {
        setEnvHeight(imgRef.current?.offsetHeight);
      }
    }
  }, [imgRef]);

  //  if my own, show this option to show/hide
  const markPaidButton = (
    <Button
      color={'primary'}
      iconSize={14}
      style={{ fontSize: 14, height: 48, width: '100%', marginBottom: 20 }}
      endingIcon={'paid'}
      text={paid ? 'Mark Unpaid' : 'Mark Paid'}
      loading={saving === 'paid'}
      onClick={(e) => {
        e.stopPropagation();
        setExtrasPropertyAndSave('paid', !paid);
      }}
    />
  );

  const awardBadgeButton = !badgeRecipient && (
    <Button
      color={'primary'}
      iconSize={14}
      endingIcon={'offline_bolt'}
      style={{ fontSize: 14, height: 48, width: '100%', marginBottom: 20 }}
      text={badgeRecipient ? 'Badge Awarded' : 'Award Badge'}
      disabled={badgeRecipient ? true : false}
      loading={saving === 'badgeRecipient'}
      onClick={(e) => {
        e.stopPropagation();
        if (!badgeRecipient) {
          setShowBadgeAwardDialog(true);
        }
      }}
    />
  );

  const actionButtons = isMine && (
    <ButtonRow>
      {showBadgeAwardDialog ? (
        <>
          <Form
            loading={saving === 'badgeRecipient'}
            smallForm
            buttonsOnBottom
            wrapStyle={{ padding: 0, margin: 0, maxWidth: '100%' }}
            close={() => setShowBadgeAwardDialog(false)}
            onSubmit={(e) => {
              sendBadge(e);
            }}
            submitText={'Send Badge'}
            schema={sendBadgeSchema}
          />
          <div style={{ height: 100 }} />
        </>
      ) : (
        <>
          {markPaidButton}
          {awardBadgeButton}
        </>
      )}
    </ButtonRow>
  );

  const nametag = (
    <NameTag
      iconSize={24}
      textSize={13}
      style={{ marginBottom: 10 }}
      {...person}
      created={created}
      widget={'wanted'}
    />
  );

  function renderCodingTask() {
	
    /*const { status } = (ticketUrl && person != undefined)
      ? extractGithubIssueFromUrl(person, ticketUrl)
      : extractGithubIssue(person, repo, issue);*/
			

    let assigneeLabel: any = null;

    if (assigneeInfo) {
      if (!isMobile) {
        assigneeLabel = (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 12,
              color: color.grayish.G100,
              marginTop: isMobile ? 20 : 0,
              marginLeft: '-16px'
            }}
          >
            <Img
              src={assigneeInfo.img || '/static/person_placeholder.png'}
              style={{ borderRadius: 30 }}
            />

            <Assignee
              color={color}
              onClick={() => {
                const profileUrl = `https://community.sphinx.chat/p/${assigneeInfo.owner_pubkey}`;
                sendToRedirect(profileUrl);
              }}
              style={{ marginLeft: 3, fontWeight: 500, cursor: 'pointer' }}
            >
              {assigneeInfo.owner_alias}
            </Assignee>
          </div>
        );
      } else {
        assigneeLabel = (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 12,
              color: color.grayish.G100,
              marginLeft: '16px'
            }}
          >
            <Img
              src={assigneeInfo.img || '/static/person_placeholder.png'}
              style={{ borderRadius: 30 }}
            />

            <Assignee
              color={color}
              onClick={() => {
                const profileUrl = `https://community.sphinx.chat/p/${assigneeInfo.owner_pubkey}`;
                sendToRedirect(profileUrl);
              }}
              style={{ marginLeft: 3, fontWeight: 500, cursor: 'pointer' }}
            >
              {assigneeInfo.owner_alias}
            </Assignee>
          </div>
        );
      }
    }

    if (isMobile) {
      let handleCopy;

      handleCopy = handleCopyUrlProfilePage;

      const { location } = window;
      const { href } = location;

      if (href.includes('tickets')) {
        handleCopy = handleCopyUrl;
      }

      return (
        <CodingMobile
          {...props}
          labels={labels}
          nametag={nametag}
          assigneeLabel={assigneeLabel}
          actionButtons={actionButtons}
          //status={status}
          handleCopyUrl={handleCopy}
          isCopied={isCopied}
          titleString={titleString}
        />
      );
    }

    // desktop view
    if (fromBountyPage) {
      return (
        <CodingBounty
          {...props}
          awardDetails={awardDetails}
          setAwardDetails={setAwardDetails}
          isAssigned={isAssigned}
          dataValue={dataValue}
          assigneeValue={assigneeValue}
          assignedPerson={assignedPerson}
          changeAssignedPerson={changeAssignedPerson}
          sendToRedirect={sendToRedirect}
          handleCopyUrl={handleCopyUrl}
          isCopied={isCopied}
          setExtrasPropertyAndSave={setExtrasPropertyAndSave}
          setIsModalSideButton={setIsModalSideButton}
          replitLink={replitLink}
          assigneeHandlerOpen={assigneeHandlerOpen}
          setCreatorStep={setCreatorStep}
          setIsExtraStyle={setIsExtraStyle}
          awards={awards}
          setExtrasPropertyAndSaveMultiple={setExtrasPropertyAndSaveMultiple}
          handleAssigneeDetails={handleAssigneeDetails}
          peopleList={peopleList}
          setIsPaidStatusBadgeInfo={setIsPaidStatusBadgeInfo}
          bountyPrice={bountyPrice}
          selectedAward={selectedAward}
          handleAwards={handleAwards}
          repo={repo}
          issue={issue}
          isMarkPaidSaved={isMarkPaidSaved}
          setBountyPrice={setBountyPrice}
          owner_idURL={owner_idURL}
          createdURL={createdURL}
          creatorStep={creatorStep}
          isPaidStatusBadgeInfo={isPaidStatusBadgeInfo}
          isPaidStatusPopOver={isPaidStatusPopOver}
          titleString={titleString}
          nametag={nametag}
        />
      );
    }

    return (
      <div>
        <CodingDesktop
          {...props}
          actionButtons={actionButtons}
          nametag={nametag}
          assigneeLabel={assigneeLabel}
          assignee={assignee}
          loomEmbedUrl={loomEmbedUrl}
          titleString={titleString}
          //status={status}
          handleCopyUrl={handleCopyUrlProfilePage}
          isCopied={isCopied}
        />
      </div>
    );
  }

  if (type === 'coding_task' || type === 'wanted_coding_task' || type === 'freelance_job_request') {
    return renderCodingTask();
  }
  if (isMobile) {
    return (
      <div style={{ padding: 20, overflow: 'auto' }} key={created}>
        <Pad>
          {nametag}

          <T>{titleString || 'No title'}</T>
          <Divider
            style={{
              marginTop: 22
            }}
          />
          <Y>
            <P color={color}>
              {formatPrice(priceMin) || '0'} <B color={color}>SAT</B> - {formatPrice(priceMax)}{' '}
              <B color={color}>SAT</B>
            </P>
            {heart}
          </Y>
          <Divider style={{ marginBottom: 22 }} />

          <D color={color}>{renderMarkdown(description)}</D>
          <GalleryViewer
            gallery={gallery}
            showAll={true}
            selectable={false}
            wrap={false}
            big={true}
          />
        </Pad>
      </div>
    );
  }

  console.log('we get here?');
  return (
    <div
      key={created}
      style={{
        paddingTop: gallery && '40px'
      }}
    >
      <Wrap color={color}>
        <div>
          <GalleryViewer
            innerRef={imgRef}
            style={{ width: 507, height: 'fit-content' }}
            gallery={gallery}
            showAll={false}
            selectable={false}
            wrap={false}
            big={true}
          />
        </div>
        <div
          style={{
            width: 316,
            padding: '40px 20px',
            overflowY: 'auto',
            height: envHeight
          }}
        >
          <Pad>
            {nametag}

            <Title>{titleString}</Title>

            <Divider style={{ marginTop: 22 }} />
            <Y>
              <P color={color}>
                {formatPrice(priceMin) || '0'} <B color={color}>SAT</B> -{' '}
                {formatPrice(priceMax) || '0'} <B color={color}>SAT</B>
              </P>
              {heart}
            </Y>
            <Divider style={{ marginBottom: 22 }} />

            <Paragraph>{renderMarkdown(description)}</Paragraph>
          </Pad>
        </div>
      </Wrap>
    </div>
  );
}
