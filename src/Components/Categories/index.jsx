import React, { useEffect as startEffect } from 'react';
import {
  useSelector as selectState,
  useDispatch as dispatchAction,
} from 'react-redux';
import { Box, Typography as TextUI, Paper as PaperUI } from '@mui/material';
import { styled } from '@mui/system';
// import categoriesSlice from '../../store/categories';
// Add import of retrieveCategories
import categoriesSlice, { retrieveCategories } from '../../store/categories';

const StyledPaper = styled(PaperUI)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2),
  cursor: 'pointer',
  '&.activeCategory': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

function Categories() {
  const categories = selectState((storefront) => storefront.categories);
  const dispatch = dispatchAction();

  let { loadCategories, changeActiveCategory, resetActiveCategory } =
    categoriesSlice.actions;

  const handleCategoryInteraction = (event) => {
    if (
      event.target.innerText.toLowerCase() === categories.activeCategory.name
    ) {
      dispatch(resetActiveCategory({}));
      let categorySelectors = document.getElementsByClassName('activeCategory');
      for (let i = 0; i < categorySelectors.length; i++) {
        categorySelectors[i].classList.remove('activeCategory');
      }
    } else {
      dispatch(changeActiveCategory(event.target.innerText));
      let categorySelectors = document.getElementsByClassName('activeCategory');
      for (let i = 0; i < categorySelectors.length; i++) {
        categorySelectors[i].classList.remove('activeCategory');
      }
      event.target.classList.add('activeCategory');
    }
  };

  // startEffect(() => {
  //   dispatch(categoriesSlice.retrieveCategories()).then((response) =>
  //     dispatch(loadCategories(response))
  //   );
  // }, []);
  startEffect(() => {
    dispatch(retrieveCategories()).then((response) =>
      dispatch(loadCategories(response))
    );
  }, []);

  return categories.categories ? (
    <>
      <TextUI variant="h5" component="div">
        Categories:
      </TextUI>
      <Box
        component="div"
        id="categoryContainer"
        data-testid="categoryContainer"
      >
        {categories.categories.map((category) => {
          return (
            <StyledPaper
              key={`paper_${category.name}`}
              data-testid={`paper_${category.name}`}
              onClick={handleCategoryInteraction}
              elevation={4}
              className="categorySelector"
            >
              {category.name[0].toUpperCase() + category.name.slice(1)}
            </StyledPaper>
          );
        })}
      </Box>
    </>
  ) : null;
}

export default Categories;
