import React, { Fragment } from 'react';
import { graphql } from 'gatsby';

import ItemsPage from '../components/ItemsPage';
import Spacer from '../components/Spacer';
import TrackCard from '../components/tracks/Card';

import SquareCharacter from '../images/characters/Square_4.mini.svg';
import SquareCharacter2 from '../images/characters/Square_3.mini.svg';
import AsteriskCharacter from '../images/characters/Asterik_5.mini.svg';

// import * as css from './tracks.module.css';

const TracksPage = ({ data, pageContext, location }) => {
  const { language, topic } = pageContext;
  const pageData = data.pageData.nodes[0];
  const tracks = data.tracks.nodes;
  const languages = data.languages.nodes.map(({ value }) => value);
  const topics = data.topics.nodes.map(({ value }) => value);

  const placeholderMainTrackImage =
    data.placeholderMainTrackImage.childImageSharp.gatsbyImageData;
  const placeholderSideTrackImage =
    data.placeholderSideTrackImage.childImageSharp.gatsbyImageData;

  return (
    <ItemsPage
      title={pageData.title}
      selectedLanguage={language}
      selectedTopic={topic}
      description={pageData.description}
      image={placeholderMainTrackImage}
      location={location}
      itemsPath="tracks"
      variant="red"
      Character={SquareCharacter}
      SeparatorCharacter={SquareCharacter2}
      EndPageCharacter={AsteriskCharacter}
      characterOrientation="center"
      languages={languages}
      topics={topics}
      showPagination={tracks.length > 0}
      previousPagePath={pageContext.previousPagePath}
      numberOfPages={pageContext.numberOfPages}
      nextPagePath={pageContext.nextPagePath}
      humanPageNumber={pageContext.humanPageNumber}>
      {(filters) =>
        tracks.map((track) => (
          <Fragment key={track.slug}>
            <TrackCard
              {...track}
              image={
                track.cover?.file.childImageSharp.gatsbyImageData ??
                (track.type === 'main'
                  ? placeholderMainTrackImage
                  : placeholderSideTrackImage)
              }
              path={`/tracks/${track.slug}`}
              variant="red"
              filters={filters}
            />
            <Spacer />
          </Fragment>
        ))
      }
    </ItemsPage>
  );
};

export const query = graphql`
  query (
    $skip: Int!
    $limit: Int!
    $topicRegex: String!
    $languageRegex: String!
  ) {
    pageData: allTracksPageInfo {
      nodes {
        title
        description
      }
    }
    tracks: allTrack(
      filter: {
        languagesFlat: { regex: $languageRegex }
        topicsFlat: { regex: $topicRegex }
      }
      sort: { order: ASC, fields: order }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        title
        slug
        description
        numVideos
        type
        languages
        topics
        videos {
          slug
          languages
          topics
          title
        }
        chapters {
          title
          videos {
            slug
            languages
            topics
            title
          }
        }
        cover {
          file {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
    placeholderMainTrackImage: file(
      sourceInstanceName: { eq: "main-tracks" }
      extension: { in: ["jpg", "png"] }
      name: { eq: "placeholder" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }
    placeholderSideTrackImage: file(
      sourceInstanceName: { eq: "side-tracks" }
      extension: { in: ["jpg", "png"] }
      name: { eq: "placeholder" }
    ) {
      childImageSharp {
        gatsbyImageData
      }
    }
    languages: allTag(filter: { type: { eq: "language" } }) {
      nodes {
        value
      }
    }
    topics: allTag(filter: { type: { eq: "topic" } }) {
      nodes {
        value
      }
    }
  }
`;

export default TracksPage;
